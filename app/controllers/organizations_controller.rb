class OrganizationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_organization, only: [:show, :edit, :update, :destroy]

  def index
    authorize Organization
    @organizations = policy_scope(Organization).unarchived
  end

  def show
    authorize @organization
  end

  def new
    @organization = Organization.new(parent_id: params[:parent_id])
    authorize @organization
  end

  def edit
    authorize @organization
  end

  def create
    @organization = Organization.new(permitted_organization_params)
    
    # Set name translation using Mobility
    Mobility.with_locale(I18n.locale) do
      @organization.name = params[:organization][:name]
    end
    
    # Set is_trial flag if user is not admin and creating top-level org
    if !current_user.is_go3_admin? && !@organization.parent_id.present?
      @organization.is_trial = true
    end
    
    if @organization.save
      # Add current user as admin of the organization
      member = Member.new(
        user: current_user,
        organization: @organization,
        email: current_user.email
      ) unless current_user.is_go3_admin?

      member.name = current_user.full_name
      if member.save
        redirect_to @organization, notice: 'Organization was successfully created.'
      else
        puts "---------------------------------"
        puts member.errors.full_messages
        puts "---------------------------------"
      end
    else
      puts "---------------------------------"
      puts @organization.errors.full_messages
      puts "---------------------------------"
      render :new
    end
  end

  def update
    authorize @organization
    
    if @organization.update(permitted_organization_params)
      redirect_to @organization, notice: 'Organization was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    authorize @organization
    
    ActiveRecord::Base.transaction do
      if @organization.is_trial? || current_user.has_role?('GO3_Admin')
        # Explicitly archive rather than destroy
        if @organization.archive
          redirect_to organizations_path, notice: 'Organization was successfully archived.'
        else
          redirect_to organizations_path, alert: 'Failed to archive organization.'
        end
      else
        redirect_to organizations_path, alert: 'Only trial organizations can be archived by organization admins.'
      end
    end
  end

  private

  def set_organization
    puts params
    @organization = Organization.unarchived.find(params[:id])
    puts @organization.inspect
  rescue ActiveRecord::RecordNotFound
    # Attempt to find the record even if it's archived
    @organization = Organization.archived.find(params[:id])
    redirect_to organizations_path, alert: 'The organization you are looking for has been archived.' if @organization.archived?
  end

  def permitted_organization_params
    params.require(:organization).permit(*policy(@organization || Organization).permitted_attributes)
  end
end 