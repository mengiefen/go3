require 'rails_helper'

RSpec.describe Role, type: :model do
  describe "database schema" do
    it { should have_db_column(:name).of_type(:jsonb).with_options(null: false) }
    it { should have_db_column(:description).of_type(:jsonb) }
    it { should have_db_column(:parent_id).of_type(:integer) }
    it { should have_db_column(:organization_id).of_type(:integer) }
    it { should have_db_column(:department_id).of_type(:integer) }
    it { should have_db_column(:active).of_type(:boolean).with_options(default: true) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index(:name).using(:gin) }
    it { should have_db_index([:parent_id]) }
    it { should have_db_index([:organization_id]) }
    it { should have_db_index([:department_id]) }
  end

  describe "validations" do
    it { should validate_presence_of(:name) }
    
    it "validates uniqueness of name within organization scope" do
      organization = create(:organization)
      role1 = create(:role, organization: organization)
      role2 = build(:role, name: role1.name, organization: organization)
      expect(role2).not_to be_valid
      expect(role2.errors[:name]).to include(/has already been taken/)
    end
  end

  describe "associations" do
    it { should belong_to(:organization).optional(false) }
    it { should belong_to(:department).optional(true) }
    it { should belong_to(:parent).class_name('Role').optional(true) }
    it { should have_many(:children).class_name('Role').with_foreign_key('parent_id') }
    it { should have_many(:permissions).as(:subject) }
    it { should have_many(:role_assignments) }
  end

  describe "hierarchy" do
    let(:organization) { create(:organization) }
    let(:grandparent) { create(:role, name: 'Grandparent', organization: organization) }
    let(:parent) { create(:role, name: 'Parent', parent: grandparent, organization: organization) }
    let(:child) { create(:role, name: 'Child', parent: parent, organization: organization) }
    
    it "builds correct ancestry chain" do
      expect(child.ancestor_chain).to eq([child, parent, grandparent])
    end
    
    it "prevents circular references" do
      grandparent.parent = child
      expect(grandparent).not_to be_valid
      expect(grandparent.errors[:parent_id]).to include(/circular reference/)
    end
    
    it "collects permissions from parent roles" do
      grandparent_perm = create(:permission, permission_code: 'admin.read', subject: grandparent)
      parent_perm = create(:permission, permission_code: 'admin.write', subject: parent)
      child_perm = create(:permission, permission_code: 'admin.delete', subject: child)
      
      all_permissions = child.all_permissions
      
      expect(all_permissions).to include(grandparent_perm)
      expect(all_permissions).to include(parent_perm)
      expect(all_permissions).to include(child_perm)
    end
  end

  describe "PaperTrail" do
    it { should be_versioned }
    
    it "tracks changes to role attributes" do
      role = create(:role)
      
      expect {
        role.update(name: { en: 'Updated Role Name' })
      }.to change { role.versions.count }.by(1)
      
      expect(role.versions.last.changeset).to have_key("name")
    end
  end
  
  describe "scopes" do
    let(:organization) { create(:organization) }
    let!(:active_role) { create(:role, organization: organization, active: true) }
    let!(:inactive_role) { create(:role, organization: organization, active: false) }
    
    it "returns active roles" do
      expect(Role.active).to include(active_role)
      expect(Role.active).not_to include(inactive_role)
    end
  end
  
  describe "member assignment" do
    let(:organization) { create(:organization) }
    let(:role) { create(:role, organization: organization) }
    let(:member) { create(:member, organization: organization) }
    let(:other_member) { create(:member, organization: organization) }
    let(:different_org_member) { create(:member) }
    
    describe "#member" do
      it "returns nil when no member is assigned" do
        expect(role.member).to be_nil
      end
      
      it "returns the assigned member" do
        create(:role_assignment, role: role, assignee: member, organization: organization)
        expect(role.member).to eq(member)
      end
      
      it "returns only the active assignment" do
        create(:role_assignment, :inactive, role: role, assignee: other_member, organization: organization)
        create(:role_assignment, role: role, assignee: member, organization: organization)
        expect(role.member).to eq(member)
      end
    end
    
    describe "#assign_member" do
      it "assigns a member to the role" do
        expect {
          result = role.assign_member(member)
          expect(result).to be true
        }.to change { RoleAssignment.count }.by(1)
        
        expect(role.member).to eq(member)
      end
      
      it "closes previous assignment and creates a new one" do
        role.assign_member(member)
        
        expect {
          role.assign_member(other_member)
        }.to change { RoleAssignment.count }.by(1)
          .and change { RoleAssignment.active.count }.by(0)
        
        # Check that previous assignment was closed
        first_assignment = RoleAssignment.inactive.where(assignee: member).first
        expect(first_assignment.finish_date).not_to be_nil
        
        # Check that new assignment is active
        expect(role.member).to eq(other_member)
      end
      
      it "returns false for invalid member" do
        expect(role.assign_member(nil)).to be false
      end
      
      it "returns false for member from different organization" do
        expect(role.assign_member(different_org_member)).to be false
      end
    end
    
    describe "#unassign_member" do
      before do
        role.assign_member(member)
      end
      
      it "unassigns the current member" do
        expect {
          role.unassign_member
        }.not_to change { RoleAssignment.count }
        
        expect(role.member).to be_nil
        expect(RoleAssignment.active.where(role: role)).to be_empty
      end
      
      it "does nothing if no member is assigned" do
        role.unassign_member
        
        expect {
          role.unassign_member
        }.not_to change { RoleAssignment.where(role: role).count }
      end
    end
  end
  
  describe "department association" do
    let(:organization) { create(:organization) }
    let(:department) { create(:department, organization: organization) }
    
    it "can be associated with a department" do
      role = create(:role, department: department, organization: organization)
      expect(role.department).to eq(department)
    end
    
    it "can be created without a department" do
      role = create(:role, department: nil, organization: organization)
      expect(role.department).to be_nil
    end
  end
end 