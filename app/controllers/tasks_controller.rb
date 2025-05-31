class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :edit, :update, :destroy]
  before_action :set_organization

  def index
    @tasks = current_tasks.includes(:user)
    @tasks = filter_tasks(@tasks)
    @categories = Task::CATEGORIES
    @selected_category = params[:category]
    @selected_status = params[:status]
  end

  def show
  end

  def new
    @task = current_tasks.build
  end

  def create
    @task = current_tasks.build(task_params)
    @task.user = current_user

    if @task.save
      respond_to do |format|
        format.html { redirect_to tasks_path, notice: 'Task created successfully.' }
        format.turbo_stream { render turbo_stream: turbo_stream.prepend('tasks-list', partial: 'task_card', locals: { task: @task }) }
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream { render :new, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if @task.update(task_params)
      respond_to do |format|
        format.html { redirect_to @task, notice: 'Task updated successfully.' }
        format.turbo_stream { render turbo_stream: turbo_stream.replace(dom_id(@task), partial: 'task_card', locals: { task: @task }) }
      end
    else
      respond_to do |format|
        format.html { render :edit, status: :unprocessable_entity }
        format.turbo_stream { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @task.destroy

    respond_to do |format|
      format.html { redirect_to tasks_path, notice: 'Task deleted successfully.' }
      format.turbo_stream { render turbo_stream: turbo_stream.remove(dom_id(@task)) }
    end
  end

  def complete
    @task = current_tasks.find(params[:id])
    @task.complete!

    respond_to do |format|
      format.html { redirect_to tasks_path }
      format.turbo_stream { render turbo_stream: turbo_stream.replace(dom_id(@task), partial: 'task_card', locals: { task: @task }) }
    end
  end

  def sidebar_content
    @sidebar_type = params[:sidebar_type]
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update("secondary-sidebar", 
          render_to_string(SecondarySidebarComponent.new(sidebar_type: @sidebar_type))
        )
      end
    end
  end
  
  def tab_content
    @filter_type = params[:filter_type] # 'category', 'status', 'priority'
    @filter_value = params[:filter_value]
    @content_name = params[:content_name]
    @tab_id = "tab-tasks-#{@filter_type}-#{@filter_value}"
    
    Rails.logger.info "=== Task Tab Content Debug ==="
    Rails.logger.info "Filter type: #{@filter_type}"
    Rails.logger.info "Filter value: #{@filter_value}"
    Rails.logger.info "Organization: #{@organization&.name}"
    Rails.logger.info "Current user: #{current_user&.email}"
    Rails.logger.info "Current tasks count: #{current_tasks.count}"
    
    # Filter tasks based on type
    @tasks = current_tasks.includes(:user)
    case @filter_type
    when 'category'
      @tasks = @filter_value == 'all' ? @tasks : @tasks.by_category(@filter_value)
    when 'status'
      @tasks = @tasks.by_status(@filter_value)
    when 'priority'
      @tasks = @tasks.by_priority(@filter_value)
    end
    @tasks = @tasks.order(created_at: :desc)
    
    Rails.logger.info "Filtered tasks count: #{@tasks.count}"

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.append("tab-content-area", 
          render_to_string(partial: 'task_tab_content', locals: {
            tasks: @tasks,
            tab_id: @tab_id,
            content_name: @content_name,
            filter_type: @filter_type,
            filter_value: @filter_value
          })
        )
      end
    end
  end

  private

  def set_task
    @task = current_tasks.find(params[:id])
  end

  def set_organization
    @organization = current_user&.organizations&.first || Organization.first
  end

  def current_tasks
    @organization&.tasks || Task.none
  end

  def filter_tasks(tasks)
    tasks = tasks.by_category(params[:category]) if params[:category].present?
    tasks = tasks.by_status(params[:status]) if params[:status].present?
    tasks = tasks.by_priority(params[:priority]) if params[:priority].present?
    tasks.order(created_at: :desc)
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :priority, :category, :due_date)
  end
end
