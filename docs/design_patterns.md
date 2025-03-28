# Rails 8 SaaS Application Design Patterns

This document outlines best practices and design patterns for building scalable Ruby on Rails 8 SaaS applications.

## 1. Multi-tenancy Architecture

Three primary approaches to multi-tenancy:

### Row-level Multi-tenancy

```ruby
# Application Record with tenant scope
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  belongs_to :account, optional: true

  scope :for_tenant, ->(account) { where(account: account) }

  def self.scoped_to_tenant(account)
    where(account: account)
  end
end

# Example model with tenant scope
class Project < ApplicationRecord
  belongs_to :account

  # All queries automatically scoped to current tenant
  default_scope { where(account_id: Current.account_id) if Current.account_id }
end
```

### Schema-level Separation

```ruby
# Using Apartment gem for schema-based multi-tenancy
# config/initializers/apartment.rb
Apartment.configure do |config|
  config.excluded_models = ['Account', 'Plan', 'AdminUser']
  config.tenant_names = lambda { Account.pluck(:subdomain) }
end

# Set current tenant in middleware
class TenantMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)
    account_subdomain = request.host.split('.').first

    if account_subdomain && Account.exists?(subdomain: account_subdomain)
      Apartment::Tenant.switch!(account_subdomain)
    end

    @app.call(env)
  end
end
```

### Database-level Isolation

```ruby
# config/database.yml
production:
  primary:
    database: <%= ENV['DATABASE_URL'] %>
  tenant_<%= ENV['TENANT_ID'] %>:
    database: <%= ENV['TENANT_DATABASE_URL'] %>

# Application logic to connect to tenant database
class TenantConnector
  def self.connect_to_tenant(tenant_id)
    ActiveRecord::Base.connected_to(role: :"tenant_#{tenant_id}") do
      yield if block_given?
    end
  end
end
```

## 2. Domain-Driven Design (DDD)

### Bounded Contexts

```ruby
# app/bounded_contexts/billing/models/subscription.rb
module Billing
  module Models
    class Subscription < ApplicationRecord
      self.table_name = 'billing_subscriptions'

      belongs_to :account
      belongs_to :plan

      validates :status, inclusion: { in: %w[active past_due canceled] }

      def active?
        status == 'active'
      end
    end
  end
end

# app/bounded_contexts/billing/services/subscription_service.rb
module Billing
  module Services
    class SubscriptionService
      def initialize(account)
        @account = account
      end

      def create_subscription(plan:, payment_method_id:)
        # Implementation of subscription creation logic
      end
    end
  end
end
```

### Service Objects

```ruby
# app/services/projects/creator.rb
module Projects
  class Creator
    def initialize(account, params)
      @account = account
      @params = params
    end

    def call
      return OpenStruct.new(success?: false, errors: ["Account limit reached"]) if limit_reached?

      project = @account.projects.build(@params)

      if project.save
        # Send notifications, create initial resources, etc.
        OpenStruct.new(success?: true, project: project)
      else
        OpenStruct.new(success?: false, errors: project.errors.full_messages)
      end
    end

    private

    def limit_reached?
      @account.projects.count >= @account.plan.project_limit
    end
  end
end

# Usage in controller
def create
  result = Projects::Creator.new(current_account, project_params).call

  if result.success?
    redirect_to project_path(result.project), notice: "Project created successfully!"
  else
    @project = @account.projects.build(project_params)
    @errors = result.errors
    render :new
  end
end
```

## 3. Modular Monolith Architecture

### Rails Engines

```ruby
# engines/billing/billing.gemspec
Gem::Specification.new do |spec|
  spec.name        = "billing"
  spec.version     = "0.1.0"
  spec.authors     = ["Your Name"]
  spec.summary     = "Billing system for SaaS application"

  spec.files = Dir["{app,config,db,lib}/**/*"]

  spec.add_dependency "rails", "~> 8.0.0"
  spec.add_dependency "stripe", "~> 10.0"
end

# engines/billing/app/controllers/billing/subscriptions_controller.rb
module Billing
  class SubscriptionsController < ApplicationController
    def new
      @subscription = Subscription.new
      @plans = Plan.active
    end

    def create
      # Implementation
    end
  end
end

# In main application:
# config/routes.rb
Rails.application.routes.draw do
  mount Billing::Engine => "/billing"
  # Other routes
end
```

## 4. Asynchronous Processing

### Solid Queue (Rails 8)

```ruby
# app/jobs/notification_job.rb
class NotificationJob < ApplicationJob
  queue_as :notifications

  def perform(user_id, message)
    user = User.find(user_id)
    NotificationService.new(user).deliver(message)
  end
end

# Usage
NotificationJob.perform_later(user.id, "Your project was updated")

# Implementing concurrency control
class ProcessPaymentJob < ApplicationJob
  queue_as :payments

  # Prevents concurrent processing of the same subscription
  discard_on ActiveJob::ConcurrencyError
  unique_for 1.hour, on: :subscription_id

  def perform(subscription_id)
    subscription = Subscription.find(subscription_id)
    PaymentProcessor.new(subscription).process_payment
  end
end
```

### Event-Driven Architecture

```ruby
# app/models/concerns/publishable.rb
module Publishable
  extend ActiveSupport::Concern

  included do
    after_create :publish_created_event
    after_update :publish_updated_event
    after_destroy :publish_destroyed_event
  end

  private

  def publish_created_event
    event_name = "#{self.class.name.underscore}_created"
    EventPublisher.publish(event_name, self.attributes)
  end

  # Similar methods for update and destroy
end

# app/lib/event_publisher.rb
class EventPublisher
  def self.publish(event_name, payload)
    # Publish to Redis, RabbitMQ, etc.
    event = {
      name: event_name,
      payload: payload,
      timestamp: Time.current
    }

    # Example with Redis
    REDIS.publish('events', event.to_json)

    # Example with ActiveSupport::Notifications
    ActiveSupport::Notifications.instrument(event_name, payload)
  end
end

# app/subscribers/project_subscriber.rb
class ProjectSubscriber
  def self.start
    ActiveSupport::Notifications.subscribe('project_created') do |*args|
      event = ActiveSupport::Notifications::Event.new(*args)
      ProjectCreatedJob.perform_later(event.payload)
    end
  end
end

# config/initializers/subscribers.rb
Rails.application.config.after_initialize do
  ProjectSubscriber.start
  # More subscribers
end
```

## 5. Caching Strategies

### Solid Cache (Rails 8)

```ruby
# config/application.rb
config.solid_cache.options[:expires_in] = 1.hour

# In models/views
Rails.cache.fetch("user/#{user.id}/dashboard", expires_in: 15.minutes) do
  # Expensive operation
  generate_dashboard_data(user)
end
```

### Fragment Caching

```erb
<%# app/views/projects/index.html.erb %>
<% cache [current_account, 'projects', @projects.maximum(:updated_at)] do %>
  <div class="projects-container">
    <% @projects.each do |project| %>
      <% cache project do %>
        <%= render partial: 'project', locals: { project: project } %>
      <% end %>
    <% end %>
  </div>
<% end %>
```

### Russian Doll Caching

```erb
<%# app/views/projects/show.html.erb %>
<% cache project do %>
  <div class="project-details">
    <h1><%= project.name %></h1>

    <div class="tasks">
      <% project.tasks.each do |task| %>
        <% cache task do %>
          <%= render partial: 'tasks/task', locals: { task: task } %>
        <% end %>
      <% end %>
    </div>

    <div class="comments">
      <% project.comments.each do |comment| %>
        <% cache comment do %>
          <%= render partial: 'comments/comment', locals: { comment: comment } %>
        <% end %>
      <% end %>
    </div>
  </div>
<% end %>
```

## 6. API Design

### JSON:API Standard

```ruby
# Gemfile
gem 'jsonapi-serializer'

# app/serializers/project_serializer.rb
class ProjectSerializer
  include JSONAPI::Serializer

  attributes :name, :description, :status

  attribute :created_at do |project|
    project.created_at.iso8601
  end

  belongs_to :account
  has_many :tasks
end

# app/controllers/api/v1/projects_controller.rb
module Api
  module V1
    class ProjectsController < ApiController
      def index
        projects = current_account.projects

        render json: ProjectSerializer.new(projects,
          include: params[:include],
          meta: { total: projects.count }
        )
      end
    end
  end
end
```

### GraphQL

```ruby
# app/graphql/types/project_type.rb
module Types
  class ProjectType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String
    field :status, String
    field :tasks, [Types::TaskType], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

# app/graphql/queries/projects.rb
module Queries
  class Projects < Queries::BaseQuery
    type [Types::ProjectType], null: false

    argument :status, String, required: false

    def resolve(status: nil)
      projects = context[:current_account].projects
      projects = projects.where(status: status) if status
      projects
    end
  end
end
```

## 7. Single Responsibility Principle

### Thin Controllers

```ruby
# app/controllers/projects_controller.rb
class ProjectsController < ApplicationController
  def create
    @project = Projects::Creator.new(current_account, project_params).call

    if @project.valid?
      redirect_to @project, notice: 'Project was successfully created.'
    else
      render :new
    end
  end

  private

  def project_params
    params.require(:project).permit(:name, :description, :status)
  end
end
```

### Form Objects

```ruby
# app/forms/project_form.rb
class ProjectForm
  include ActiveModel::Model

  attr_accessor :name, :description, :status, :account_id
  attr_accessor :task_attributes

  validates :name, presence: true
  validates :status, inclusion: { in: %w[draft active completed] }

  def save
    return false unless valid?

    ActiveRecord::Base.transaction do
      @project = Project.create!(
        name: name,
        description: description,
        status: status,
        account_id: account_id
      )

      task_attributes.each do |task_attr|
        @project.tasks.create!(task_attr)
      end
    end

    true
  rescue ActiveRecord::RecordInvalid => e
    errors.add(:base, e.message)
    false
  end

  def project
    @project
  end
end

# In controller
def create
  @form = ProjectForm.new(project_form_params)
  @form.account_id = current_account.id

  if @form.save
    redirect_to @form.project, notice: 'Project was successfully created.'
  else
    render :new
  end
end
```

## 8. Modern Frontend Integration

### Hotwire (Turbo + Stimulus)

```html
<!-- app/views/projects/_project.html.erb -->
<div id="<%= dom_id(project) %>" class="project-card">
  <h3><%= project.name %></h3>
  <div class="actions">
    <%= button_to "Complete", complete_project_path(project), method: :patch, form: { data: { turbo_frame:
    dom_id(project) } } %>
  </div>
</div>

<!-- app/views/projects/complete.turbo_stream.erb -->
<turbo-stream action="replace" target="<%= dom_id(@project) %>">
  <template> <%= render partial: "project", locals: { project: @project } %> </template>
</turbo-stream>
```

```javascript
// app/javascript/controllers/project_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['name', 'status'];

  initialize() {
    this.updateStatusClass();
  }

  updateStatusClass() {
    const status = this.statusTarget.textContent;
    this.element.classList.add(`status-${status}`);
  }
}
```

### Tailwind CSS Components

```erb
<!-- app/views/components/_button.html.erb -->
<%= tag.button(
  class: "px-4 py-2 rounded-md font-medium #{variant_classes[variant]} #{size_classes[size]}",
  **options
) do %>
  <%= content %>
<% end %>

<%
def variant_classes
  {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  }
end

def size_classes
  {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg px-6 py-3"
  }
end
%>

<!-- Usage -->
<%= render partial: "components/button", locals: {
  variant: :primary,
  size: :md,
  options: { type: "submit", data: { controller: "form" } }
} do %>
  Save Project
<% end %>
```

## 9. Performance Optimization

### Query Optimization

```ruby
# Bad - N+1 query problem
def index
  @projects = current_account.projects
  # In the view, each project.tasks causes a new query
end

# Good - Eager loading
def index
  @projects = current_account.projects.includes(:tasks, :owner)
end

# Better - Adding pagination
def index
  @projects = current_account.projects
    .includes(:tasks, :owner)
    .order(created_at: :desc)
    .page(params[:page])
    .per(20)
end
```

### Counter Caches

```ruby
# db/migrate/xxxx_add_counter_cache_to_projects.rb
class AddCounterCacheToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :tasks_count, :integer, default: 0, null: false

    # Update existing records
    reversible do |dir|
      dir.up do
        Project.find_each do |project|
          Project.reset_counters(project.id, :tasks)
        end
      end
    end
  end
end

# app/models/task.rb
class Task < ApplicationRecord
  belongs_to :project, counter_cache: true
end

# Usage
project.tasks_count # No additional query
```

## 10. Security Practices

### Authorization with Pundit

```ruby
# app/policies/project_policy.rb
class ProjectPolicy < ApplicationPolicy
  def show?
    user_belongs_to_account?
  end

  def update?
    user_belongs_to_account? && (user.admin? || user.editor?)
  end

  def destroy?
    user_belongs_to_account? && user.admin?
  end

  private

  def user_belongs_to_account?
    user.account_id == record.account_id
  end
end

# app/controllers/projects_controller.rb
class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  def show
    authorize @project
    # ...
  end

  def update
    authorize @project

    if @project.update(project_params)
      redirect_to @project, notice: 'Project was successfully updated.'
    else
      render :edit
    end
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end
end
```

### Strong Parameters and Validations

```ruby
# app/controllers/projects_controller.rb
def project_params
  params.require(:project).permit(:name, :description, :status,
    task_attributes: [:title, :description, :due_date, :_destroy])
end

# app/models/project.rb
class Project < ApplicationRecord
  validates :name, presence: true, length: { maximum: 255 }
  validates :status, inclusion: { in: %w[draft active completed] }

  # Sanitize user input
  before_validation :sanitize_description

  private

  def sanitize_description
    self.description = Rails::Html::Sanitizer.full_sanitizer.sanitize(description) if description.present?
  end
end
```

### Secure Authentication

```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # Password complexity
  config.password_length = 12..128

  # Security features
  config.lock_strategy = :failed_attempts
  config.unlock_strategy = :time
  config.maximum_attempts = 5
  config.unlock_in = 1.hour

  # 2FA
  config.two_factor_authentication_options = {
    methods: [:app],
    otp_length: 6,
    issuer: "YourSaaS"
  }
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :verify_two_factor_authenticated

  private

  def verify_two_factor_authenticated
    return unless user_signed_in?
    return if current_user.two_factor_authenticated?

    redirect_to new_user_two_factor_authentication_path
  end
end
```

## Conclusion

These design patterns and best practices provide a solid foundation for building scalable Rails 8 SaaS applications. As your application grows, you may need to adapt these patterns or introduce new ones to meet your specific requirements.

Remember that the best architecture is one that fits your specific use case and team capabilities. Start with a well-structured application and evolve it as needed based on real-world usage and feedback.
