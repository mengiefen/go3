class RolesController < ApplicationController
  include TabContent
  before_action :authenticate_user!

  def index
    authorize current_member
    @organization = current_organization
    # Only load top-level roles (roles without parents) to avoid duplicates
    @roles = @organization.roles.includes([ :department, :children ]).where(parent_id: nil)
  end

  def new
    authorize current_member
    @organization = current_organization
    @role = Role.new(organization: @organization)
  end

  def create
    authorize current_member
    @organization = current_organization

    @role = Role.new(organization: @organization)

    # Handle translatable fields
    if role_params[:name].present?
      @role.write_attribute(:name, role_params[:name])
    end

    if role_params[:description].present?
      @role.write_attribute(:description, role_params[:description])
    end

    # Handle non-translatable fields
    @role.assign_attributes(role_non_translatable_params)

    if @role.save
      # If this is a top-level role (no parent), add it to the list
      if @role.parent_id.nil?
        level = calculate_role_level(@role)
        Turbo::StreamsChannel.broadcast_prepend_to(
          "roles_list",
          targets: ".roles_list",
          partial: "roles/role_row",
          locals: { organization: @organization, role: @role, level: level, additional_classes: "" }
        )
      else
        # If this is a child role, update the parent role to refresh its children section

        parent_role = @role.parent
        level = calculate_role_level(parent_role)

        Turbo::StreamsChannel.broadcast_action_to(
          "roles_list",
          action: :remove,
          targets: ".children-#{parent_role.id}"
        )

        Turbo::StreamsChannel.broadcast_replace_to(
          "roles_list",
          targets: ".role_row_#{parent_role.id}",
          partial: "roles/role_row",
          locals: { organization: @organization, role: parent_role, level: level, additional_classes: "" }
        )
      end

      render turbo_stream: [
        turbo_stream.replace("modal", "<turbo-frame id='modal'/>")
      ]
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    authorize current_member
    @organization = current_organization
    @role = Role.find_by(id: params[:id])
  end

  def update
    authorize current_member
    @organization = current_organization
    @role = Role.find_by(id: params[:id])

    if role_params[:name].present?
      @role.write_attribute(:name, role_params[:name])
    end

    if role_params[:description].present?
      @role.write_attribute(:description, role_params[:description])
    end

    if @role.update(role_non_translatable_params)
      broadcast_role_update

      render turbo_stream: [
        turbo_stream.replace("modal", "<turbo-frame id='modal'/>")
      ]
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def activate
    authorize current_member
    @role = Role.find_by(id: params[:id])
    @role.activate
    broadcast_role_update
  end

  def deactivate
    authorize current_member
    @role = Role.find_by(id: params[:id])
    @role.deactivate
    broadcast_role_update
  end

  def assignments
    # authorize current_member
    @organization = current_organization
    @role = Role.find_by(id: params[:id])
    @current_assignment = @role.role_assignments.active.first
    @past_assignments = @role.role_assignments.inactive.includes(:member).order(start_date: :desc)
    @available_members = current_organization.members.active.where.not(id: @role.role_assignments.active.pluck(:member_id))
  end

  def assign_member
    authorize current_member
    @role = Role.find_by(id: params[:id])
    member = Member.find_by(id: params[:member_id])

    if @role.assign_member(member)
      broadcast_role_update
      render json: { success: true }
    else
      render json: { success: false, error: "Failed to assign member" }, status: :unprocessable_entity
    end
  end

  def unassign_member
    authorize current_member
    @role = Role.find_by(id: params[:id])
    @role.unassign_member
    broadcast_role_update
  end

  def export
    authorize current_member
    @roles = current_organization.roles.includes([ :department, :parent, :role_assignments ]).order(:name)

    respond_to do |format|
      format.xlsx do
        response.headers["Content-Disposition"] = "attachment; filename=roles_#{current_organization.name.parameterize}_#{Date.current}.xlsx"
      end
    end
  end

  private

  def role_params
    params.require(:role).permit(
      :parent_id,
      :department_id,
      :organization_id,
      :active,
      name: {},
      description: {}
    )
  end

  def role_non_translatable_params
    params.require(:role).permit(
      :parent_id,
      :department_id,
      :organization_id,
      :active
    )
  end

  def broadcast_role_update
    # Determine the level based on the role's position in the hierarchy
    level = calculate_role_level(@role)
    additional_classes = ""
    additional_classes = "children-#{@role.parent_id}" if @role.parent

    Turbo::StreamsChannel.broadcast_action_to(
      "roles_list",
      action: :remove,
      targets: ".children-#{@role.id}"
    )

    Turbo::StreamsChannel.broadcast_replace_to(
      "roles_list",
      targets: ".role_row_#{@role.id}",
      partial: "roles/role_row",
      locals: { organization: @organization, role: @role, level: level, additional_classes: additional_classes }
    )
  end

  def calculate_role_level(role)
    level = 0
    current_role = role

    while current_role.parent.present?
      level += 1
      current_role = current_role.parent
    end

    level
  end
end
