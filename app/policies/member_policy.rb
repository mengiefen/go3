class MemberPolicy < ApplicationPolicy
  def index?
    record.has_permission?('Organization.admin')
  end
end