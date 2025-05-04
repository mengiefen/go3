class OrganizationPolicy < ApplicationPolicy
  def index?
    user.is_go3_admin?
  end

  def show?
    user.is_go3_admin? || user.member_of?(record)
  end

  def create?
    # GO3_Admins can always create organizations
    return true if user.is_go3_admin?
    
    # Normal users can create if they have trial flag
    return user.has_flag?('trial') if !record.parent_id.present?
    
    # Users with Organization.admin permission on parent org can create sub-orgs
    record.parent_id.present? && user.has_permission?('Organization.admin', record.parent)
  end

  def update?
    user.is_go3_admin? || user.has_permission?('Organization.admin', record)
  end

  def permitted_attributes
    if user.is_go3_admin?
      [:name, :description, :parent_id, :is_trial, :settings, :logo]
    else
      [:name, :description]
    end
  end

  def destroy?
    # GO3_Admins can destroy any organization
    return true if user.is_go3_admin?
    
    # Organization admins can only destroy trial organizations
    record.is_trial? && user.has_permission?('Organization.admin', record)
  end

  def archive?
    user.is_go3_admin?
  end

  def unarchive?
    user.is_go3_admin?
  end

  class Scope < Scope
    def resolve
      if user.is_go3_admin?
        scope.all
      else
        # Return organizations the user is a member of
        scope.joins(:members).where(members: { user_id: user.id })
      end
    end
  end
end 