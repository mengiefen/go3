class MemberPolicy < ApplicationPolicy
  def index?
    is_org_admin?
  end

  def new?
    is_org_admin?
  end

  def create?
    is_org_admin?
  end

  private 
  
  def is_org_admin?
    record.has_permission?('Organization.admin')
  end
end