class DepartmentsController < ApplicationController
  include TabContent
  before_action :authenticate_user!

  def index
    authorize current_member
    departments = current_organization.departments.order(id: :desc)
    render json: departments, status: :ok
  end

  def show
    authorize current_member
    department = current_organization.departments.find_by_id(params[:id])
    render json: { errors: [ controller_t("not_found") ] }, status: :not_found unless department
    # Tech debt: Add translation
    render json: department, status: :ok
  end

  def create
    authorize current_member

    department = Department.new(organization: current_organization, abbreviation: department_params[:abbreviation])

    # Handle translatable fields
    if department_params[:name].present?
      department.write_attribute(:name, department_params[:name])
    end

    if department_params[:description].present?
      department.write_attribute(:description, department_params[:description])
    end

    if department.save
      render json: department, status: :ok
    else
      render json: { errors: department.errors.full_messages }, status: :unprocessable_content
    end
  end

  def edit
    authorize current_member
    @department = Department.find_by(id: params[:id])
  end

  def update
    authorize current_member
    @department = Department.find_by(id: params[:id])

    if department_params[:name].present?
      @department.write_attribute(:name, department_params[:name])
    end

    if department_params[:description].present?
      @department.write_attribute(:description, department_params[:description])
    end

    if @department.update(department_non_translatable_params)
      broadcast_department_update

      render turbo_stream: [
        turbo_stream.replace("modal", "<turbo-frame id='modal'/>")
      ]
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # def destroy
  #   authorize current_member
  #   @department = Department.find_by(id: params[:id])

  #   if @department.destroy
  #     broadcast_department_update
  #     render turbo_stream: turbo_stream.remove("department_row_#{@department.id}")
  #   else
  #     render json: { error: "Failed to delete department" }, status: :unprocessable_entity
  #   end
  # end

  def export
    authorize current_member
    @departments = current_organization.departments.order(:name)

    respond_to do |format|
      format.xlsx do
        response.headers["Content-Disposition"] = "attachment; filename=departments_#{current_organization.name.parameterize}_#{Date.current}.xlsx"
      end
    end
  end

  private

  def department_params
    # Use Rails' built-in nested attributes support
    params.require(:department).permit(
      :abbreviation,
      :organization_id,
      name: {},
      description: {}
    )
  end

  def department_non_translatable_params
    # Use Rails' built-in nested attributes support
    params.require(:department).permit(
      :abbreviation,
      :organization_id,
    )
  end

  def broadcast_department_update
    Turbo::StreamsChannel.broadcast_replace_to(
      "departments_list",
      targets: ".department_row_#{@department.id}",
      partial: "departments/department_row",
      locals: { department: @department }
    )
  end
end
