class MemberPolicy < ApplicationPolicy
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

  def set_as_admin?
    is_org_admin?
  end

  def revoke_admin?
    is_org_admin?
  end

  def resend_invitation?
    is_org_admin?
  end

  def archive?
    is_org_admin?
  end
  
  def unarchive?
    is_org_admin?
  end

  private 
  
  def is_org_admin?
    record.has_permission?('Organization.admin')
  end
end