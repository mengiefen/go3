class RolePolicy < ApplicationPolicy
  def index?
    is_org_admin?
  end

  def new?
    is_org_admin?
  end

  def edit?
    is_org_admin?
  end

  def create?
    is_org_admin?
  end

  def update?
    is_org_admin?
  end

  def activate?
    is_org_admin?
  end

  def deactivate?
    is_org_admin?
  end

  def assignments?
    is_org_admin?
  end

  def assign_member?
    is_org_admin?
  end

  def unassign_member?
    is_org_admin?
  end

  def export?
    is_org_admin?
  end

  private

  def is_org_admin?
    record.has_permission?("Organization.admin")
  end
end
