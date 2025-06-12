require 'rails_helper'
require 'securerandom'

RSpec.describe Member, type: :model do
  describe "database schema" do
    it { should have_db_column(:email).of_type(:string).with_options(null: false) }
    it { should have_db_column(:name).of_type(:jsonb) }
    it { should have_db_column(:organization_id).of_type(:integer).with_options(null: false) }
    it { should have_db_column(:user_id).of_type(:integer) }
    it { should have_db_column(:status).of_type(:integer) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index(:email) }
    it { should have_db_index([:organization_id]) }
    it { should have_db_index([:user_id]) }
    it { should have_db_index(:name).using(:gin) }
  end

  describe "validations" do
    let(:organization) { create(:organization, name: { en: "Member Org #{SecureRandom.uuid}" }) }
    
    it "is not valid with a name not containing at least one translation" do
      member = build(:member, name: {}, organization: organization)
      expect(member).not_to be_valid
      expect(member.errors[:name]).to include("must contain at least one translation")
    end
    
    it "is valid with a name containing at least one translation" do
      member = build(:member, organization: organization, name: { en: "John Doe #{SecureRandom.uuid}" })
      expect(member).to be_valid
    end
    
    it { should validate_presence_of(:email) }
    
    it "validates uniqueness of email within organization scope" do
      test_email = "test-#{SecureRandom.uuid}@example.com"
      create(:member, email: test_email, organization: organization)
      
      duplicate_member = build(:member, email: test_email, organization: organization)
      expect(duplicate_member).not_to be_valid
      expect(duplicate_member.errors[:email]).to include("has already been taken")
      
      # Different organization should allow same email
      other_org = create(:organization, name: { en: "Other Org #{SecureRandom.uuid}" })
      member_diff_org = build(:member, email: test_email, organization: other_org)
      expect(member_diff_org).to be_valid
    end
    
    it { should allow_value('user@example.com').for(:email) }
    it { should_not allow_value('invalid_email').for(:email) }
  end

  describe "associations" do
    it { should belong_to(:organization).optional(false) }
    it { should belong_to(:user).optional(true) }
    it { should have_many(:role_assignments).conditions(finish_date: nil) }
    it { should have_many(:roles).through(:role_assignments) }
    it { should have_many(:inactive_role_assignments) }
    it { should have_many(:inactive_roles).through(:inactive_role_assignments).source(:role) }
    it { should have_and_belong_to_many(:groups) }
    it { should have_many(:departments).through(:roles) }
    it { should have_many(:direct_permissions).class_name('Permission').as(:grantee) }
  end

  describe "PaperTrail" do
    it { should be_versioned }
    
    it "tracks changes to member attributes" do
      org = create(:organization, name: { en: "PaperTrail Org #{SecureRandom.uuid}" })
      member = create(:member, organization: org)
      
      PaperTrail.enabled = true
      
      new_name = "Updated Member Name #{SecureRandom.uuid}"
      expect { 
        Mobility.with_locale(:en) { member.update!(name: new_name) } 
      }.to change { member.versions.count }.by(1)
      
      version = member.versions.last
      expect(version).not_to be_nil
      expect(version.event).to eq("update")
      expect(version.item_type).to eq("Member")
      expect(version.item_id).to eq(member.id)
    end
  end
  
  describe "scopes" do
    let(:organization) { create(:organization, name: { en: "Scopes Org #{SecureRandom.uuid}" }) }
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
 
  describe "#all_permissions" do
    let(:organization) { create(:organization, name: { en: "Permissions Org #{SecureRandom.uuid}" }) }
    let(:member) { create(:member, organization: organization) }
    let(:role) { create(:role, organization: organization) }
    let(:group) { create(:group, organization: organization) }
    let(:department) { create(:department, organization: organization) }
    
    let(:role_permission) { create(:permission, grantee: role, code: "members.invite") }
    let(:group_permission) { create(:permission, grantee: group, code: "members.invite") }
    let(:department_permission) { create(:permission, grantee: department, code: "members.invite") }
    let(:direct_permission) { create(:permission, grantee: member, code: "members.invite") }
    
    before do
      # Setup relationships
      create(:role_assignment, role: role, member: member)
      group.add_member(member)
      role.update(department: department)
      
      # Create permissions
      role_permission
      group_permission
      department_permission
      direct_permission
    end
    
    it "collects permissions from all sources" do
      permissions = member.all_permissions
      
      expect(permissions).to include(role_permission)
      expect(permissions).to include(group_permission)
      expect(permissions).to include(department_permission)
      expect(permissions).to include(direct_permission)
      expect(permissions.size).to eq(4)
    end
  end
  
  describe "translations" do
    let(:organization) { create(:organization, name: { en: "Translation Org #{SecureRandom.uuid}" }) }
  
    it "supports name translations" do
      member = create(:member, organization: organization, 
                      name: { "en" => "John Smith", "fr" => "Jean Smith" })
  
      Mobility.with_locale(:en) do
        expect(member.name).to eq("John Smith")
      end
  
      Mobility.with_locale(:fr) do
        expect(member.name).to eq("Jean Smith")
      end
    end
  
    it "uses fallbacks if translation is missing" do
      member = create(:member, organization: organization, name: { "en" => "Alice Johnson" })
  
      Mobility.with_locale(:fr) do
        expect(member.name).to eq("Alice Johnson") # Falls back to English
      end
    end
  end
end 