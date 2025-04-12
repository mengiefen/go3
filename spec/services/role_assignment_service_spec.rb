require 'rails_helper'

RSpec.describe RoleAssignmentService do
  let(:tenant) { create(:tenant) }
  let(:user) { create(:user, tenant: tenant) }
  let(:group) { create(:group, tenant: tenant) }
  let(:role) { create(:role, tenant: tenant) }
  let(:another_role) { create(:role, tenant: tenant) }
  let(:other_tenant_role) { create(:role) }
  
  describe "#assign" do
    context "with user assignee" do
      let(:service) { described_class.new(user: user) }
      
      it "assigns role to user" do
        result = service.assign(role)
        
        expect(result).to be_success
        expect(user.roles).to include(role)
      end
      
      it "creates audit trail for assignment" do
        expect {
          service.assign(role)
        }.to change(PaperTrail::Version, :count).by(1)
      end
      
      it "prevents duplicate assignments" do
        service.assign(role)
        result = service.assign(role)
        
        expect(result).to be_failure
        expect(result.errors).to include(/already assigned/)
      end
      
      it "prevents assignment of role from different tenant" do
        result = service.assign(other_tenant_role)
        
        expect(result).to be_failure
        expect(result.errors).to include(/cannot assign role from different tenant/)
      end
      
      it "assigns multiple roles to the same user" do
        service.assign(role)
        result = service.assign(another_role)
        
        expect(result).to be_success
        expect(user.roles).to include(role)
        expect(user.roles).to include(another_role)
      end
      
      it "assigns role with expiration date" do
        expires_at = 1.month.from_now
        result = service.assign(role, expires_at: expires_at)
        
        expect(result).to be_success
        expect(user.role_assignments.first.expires_at).to be_within(1.second).of(expires_at)
      end
    end
    
    context "with group assignee" do
      let(:service) { described_class.new(group: group) }
      
      it "assigns role to group" do
        result = service.assign(role)
        
        expect(result).to be_success
        expect(group.roles).to include(role)
      end
      
      it "creates audit trail for assignment" do
        expect {
          service.assign(role)
        }.to change(PaperTrail::Version, :count).by(1)
      end
      
      it "prevents duplicate assignments" do
        service.assign(role)
        result = service.assign(role)
        
        expect(result).to be_failure
        expect(result.errors).to include(/already assigned/)
      end
      
      it "prevents assignment of role from different tenant" do
        result = service.assign(other_tenant_role)
        
        expect(result).to be_failure
        expect(result.errors).to include(/cannot assign role from different tenant/)
      end
    end
    
    context "with invalid input" do
      it "fails if neither user nor group is provided" do
        service = described_class.new
        result = service.assign(role)
        
        expect(result).to be_failure
        expect(result.errors).to include(/must provide either user or group/)
      end
      
      it "fails if both user and group are provided" do
        service = described_class.new(user: user, group: group)
        result = service.assign(role)
        
        expect(result).to be_failure
        expect(result.errors).to include(/cannot provide both user and group/)
      end
    end
  end
  
  describe "#unassign" do
    context "with user assignee" do
      let(:service) { described_class.new(user: user) }
      
      before do
        service.assign(role)
      end
      
      it "removes role from user" do
        result = service.unassign(role)
        
        expect(result).to be_success
        expect(user.roles).not_to include(role)
      end
      
      it "creates audit trail for unassignment" do
        expect {
          service.unassign(role)
        }.to change(PaperTrail::Version, :count).by(1)
      end
      
      it "does nothing if role was not assigned" do
        service.unassign(role)
        result = service.unassign(role)
        
        expect(result).to be_success
        expect(result.message).to include(/not assigned/)
      end
    end
    
    context "with group assignee" do
      let(:service) { described_class.new(group: group) }
      
      before do
        service.assign(role)
      end
      
      it "removes role from group" do
        result = service.unassign(role)
        
        expect(result).to be_success
        expect(group.roles).not_to include(role)
      end
      
      it "creates audit trail for unassignment" do
        expect {
          service.unassign(role)
        }.to change(PaperTrail::Version, :count).by(1)
      end
      
      it "does nothing if role was not assigned" do
        service.unassign(role)
        result = service.unassign(role)
        
        expect(result).to be_success
        expect(result.message).to include(/not assigned/)
      end
    end
  end
  
  describe "#assigned_roles" do
    context "with user assignee" do
      let(:service) { described_class.new(user: user) }
      
      before do
        service.assign(role)
        service.assign(another_role)
      end
      
      it "returns all roles assigned to user" do
        roles = service.assigned_roles
        
        expect(roles).to match_array([role, another_role])
      end
      
      it "includes only active assignments when exclude_expired is true" do
        expired_role = create(:role, tenant: tenant)
        service.assign(expired_role, expires_at: 1.day.ago)
        
        roles = service.assigned_roles(exclude_expired: true)
        
        expect(roles).to match_array([role, another_role])
        expect(roles).not_to include(expired_role)
      end
      
      it "includes expired assignments when exclude_expired is false" do
        expired_role = create(:role, tenant: tenant)
        service.assign(expired_role, expires_at: 1.day.ago)
        
        roles = service.assigned_roles(exclude_expired: false)
        
        expect(roles).to match_array([role, another_role, expired_role])
      end
    end
    
    context "with group assignee" do
      let(:service) { described_class.new(group: group) }
      
      before do
        service.assign(role)
        service.assign(another_role)
      end
      
      it "returns all roles assigned to group" do
        roles = service.assigned_roles
        
        expect(roles).to match_array([role, another_role])
      end
    end
  end
end 