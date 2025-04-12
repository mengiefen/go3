require 'rails_helper'

RSpec.describe Department, type: :model do
  describe "database schema" do
    it { should have_db_column(:name).of_type(:jsonb).with_options(null: false) }
    it { should have_db_column(:description).of_type(:jsonb) }
    it { should have_db_column(:organization_id).of_type(:integer) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index(:name).using(:gin) }
    it { should have_db_index([:organization_id]) }
  end

  describe "validations" do
    it { should validate_presence_of(:name) }
    
    it "validates uniqueness of name within organization scope" do
      organization = create(:organization)
      dept1 = create(:department, organization: organization)
      dept2 = build(:department, name: dept1.name, organization: organization)
      expect(dept2).not_to be_valid
      expect(dept2.errors[:name]).to include(/has already been taken/)
    end

    let(:organization) { create(:organization) }
    
    it "is not valid with a name does not containing at least one translation" do
      department = Department.new(organization: organization, name: {})
      expect(department).not_to be_valid
      expect(department.errors[:name]).to include("must contain at least one translation")
    end
    
    it "is valid with a name containing at least one translation" do
      department = Department.new(organization: organization, name: { en: "Marketing" })
      expect(department).to be_valid
    end
  end

  describe "associations" do
    it { should belong_to(:organization).optional(false) }
    it { should have_many(:roles) }
    it { should have_many(:permissions).as(:subject) }
  end

  describe "PaperTrail" do
    it { should be_versioned }
    
    it "tracks changes to department attributes" do
      department = create(:department)
      
      expect {
        department.update(name: { en: 'Updated Department Name' })
      }.to change { department.versions.count }.by(1)
      
      expect(department.versions.last.changeset).to have_key("name")
    end
  end
  
  describe "#members" do
    let(:organization) { create(:organization) }
    let(:department) { create(:department, organization: organization) }
    let(:role) { create(:role, department: department) }
    let(:member1) { create(:member, organization: organization) }
    let(:member2) { create(:member, organization: organization) }
    
    before do
      create(:role_assignment, role: role, assignee: member1)
      create(:role_assignment, role: role, assignee: member2)
    end
    
    it "returns members assigned to roles in this department" do
      expect(department.members).to include(member1)
      expect(department.members).to include(member2)
    end
  end
  
  describe "#member_in_department?" do
    let(:organization) { create(:organization) }
    let(:department) { create(:department, organization: organization) }
    let(:role) { create(:role, department: department) }
    let(:member) { create(:member, organization: organization) }
    let(:other_member) { create(:member, organization: organization) }
    
    before do
      create(:role_assignment, role: role, assignee: member)
    end
    
    it "returns true if member is assigned to a role in this department" do
      expect(department.member_in_department?(member)).to be true
    end
    
    it "returns false if member is not assigned to a role in this department" do
      expect(department.member_in_department?(other_member)).to be false
    end
  end
   
  describe "#add_role" do
    let(:organization) { create(:organization) }
    let(:department) { create(:department, organization: organization) }
    let(:other_department) { create(:department, organization: organization) }
    let(:role) { create(:role, organization: organization) }
    
    it "associates an existing role with the department" do
      expect(role.department).to be_nil
      
      department.add_role(role)
      role.reload
      
      expect(role.department).to eq(department)
    end
    
    it "transfers a role from another department" do
      role.update(department: other_department)
      
      department.add_role(role)
      role.reload
      
      expect(role.department).to eq(department)
    end
    
    it "does nothing if the role is already associated with this department" do
      role.update(department: department)
      
      expect {
        department.add_role(role)
      }.not_to change { role.reload.department_id }
    end
  end
  
  describe "#remove_role" do
    let(:organization) { create(:organization) }
    let(:department) { create(:department, organization: organization) }
    let(:other_department) { create(:department, organization: organization) }
    let(:role) { create(:role, department: department, organization: organization) }
    
    it "removes a role from the department" do
      expect {
        department.remove_role(role)
      }.to change { department.roles.count }.by(-1)
    end
    
    it "does nothing if the role doesn't belong to this department" do
      role.update(department: other_department)
      
      expect {
        department.remove_role(role)
      }.not_to change { department.roles.count }
    end
  end

  # TODO: Implement Mobility for translations
  describe "translations" do
    let(:organization) { create(:organization) }
    
    # These tests assume Mobility is implemented
    xit "supports name translations" do
      department = Department.new(organization: organization)
      department.name_en = "Marketing"
      department.name_fr = "Marketing (FR)"
      department.save
      
      I18n.with_locale(:en) do
        expect(department.name).to eq("Marketing")
      end
      
      I18n.with_locale(:fr) do
        expect(department.name).to eq("Marketing (FR)")
      end
    end
    
    xit "uses fallbacks if translation is missing" do
      department = Department.new(organization: organization)
      department.name_en = "Sales"
      department.save
      
      I18n.with_locale(:fr) do
        expect(department.name).to eq("Sales") # Falls back to :en
      end
    end
  end
end 