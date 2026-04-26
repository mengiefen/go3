class DepartmentPolicy < ApplicationPolicy
  def index?
    is_org_admin?
  end

  def show?
    is_org_admin?
  end

  def create?
    is_org_admin?
  end

  def update?
    is_org_admin?
  end

  def destroy?
    is_org_admin?
  end

  def export?
    is_org_admin?
  end

  private

  def is_org_admin?
    current_member.has_permission?(Permission::ORG_ADMIN)
  end
end
