require 'rails_helper'

RSpec.describe Member, type: :model do
  describe "database schema" do
    it { should have_db_column(:email).of_type(:string).with_options(null: false) }
    it { should have_db_column(:first_name).of_type(:string) }
    it { should have_db_column(:last_name).of_type(:string) }
    it { should have_db_column(:organization_id).of_type(:integer) }
    it { should have_db_column(:employee_id).of_type(:string) }
    it { should have_db_column(:status).of_type(:string) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index(:email) }
    it { should have_db_index([:organization_id]) }
    it { should have_db_index([:employee_id]) }
  end

  describe "validations" do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).scoped_to(:organization_id) }
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    
    it { should allow_value('user@example.com').for(:email) }
    it { should_not allow_value('invalid_email').for(:email) }
  end

  describe "associations" do
    it { should belong_to(:organization).optional(false) }
    it { should have_many(:role_assignments).as(:assignee) }
    it { should have_many(:roles).through(:role_assignments) }
    it { should have_many(:permissions).as(:subject) }
    it { should have_and_belong_to_many(:groups) }
  end

  describe "scopes" do
    let!(:organization) { create(:organization) }
    let!(:active_member) { create(:member, organization: organization, status: 'active') }
    let!(:inactive_member) { create(:member, organization: organization, status: 'inactive') }
    
    it "returns active members" do
      expect(Member.active).to include(active_member)
      expect(Member.active).not_to include(inactive_member)
    end
    
    it "returns inactive members" do
      expect(Member.inactive).to include(inactive_member)
      expect(Member.inactive).not_to include(active_member)
    end
  end

  describe "#full_name" do
    let(:member) { create(:member, first_name: "John", last_name: "Doe") }
    
    it "returns the full name of the member" do
      expect(member.full_name).to eq("John Doe")
    end
  end
  
  describe "permissions" do
    let(:organization) { create(:organization) }
    let(:member) { create(:member, organization: organization) }
    let(:role) { create(:role, organization: organization) }
    let(:group) { create(:group, organization: organization) }
    let(:department) { create(:department, organization: organization) }
    let(:department_role) { create(:role, department: department, organization: organization) }
    
    it "can be assigned roles" do
      create(:role_assignment, role: role, assignee: member)
      expect(member.roles).to include(role)
    end
    
    it "can be added to groups" do
      group.add_member(member)
      expect(member.groups).to include(group)
    end
    
    it "can be part of departments through roles" do
      create(:role_assignment, role: department_role, assignee: member)
      
      # Should be accessible via members method on department
      expect(department.members).to include(member)
      expect(department.member_in_department?(member)).to be true
    end
    
    it "can have direct permissions" do
      permission = create(:permission, permission_code: 'user.read', subject: member)
      expect(member.permissions).to include(permission)
    end
  end
end 