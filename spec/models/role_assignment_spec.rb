require 'rails_helper'
require 'securerandom'

RSpec.describe RoleAssignment, type: :model do
  describe "database schema" do
    it { should have_db_column(:role_id).of_type(:integer).with_options(null: false) }
    it { should have_db_column(:member_id).of_type(:integer).with_options(null: false) }
    it { should have_db_column(:start_date).of_type(:datetime) }
    it { should have_db_column(:finish_date).of_type(:datetime) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index([:role_id]) }
    it { should have_db_index([:member_id]) }
    it { should have_db_index([:role_id, :member_id]) }
    it { should have_db_index([:member_id, :role_id]) }
  end

  describe "validations" do
    let(:organization) { create(:organization, name: { en: "RoleAssignment Org #{SecureRandom.uuid}" }) }
    let(:role) { create(:role, organization: organization) }
    let(:member) { create(:member, organization: organization) }
    
    it { should validate_presence_of(:role_id) }
    it { should validate_presence_of(:member_id) }
    
    it "validates uniqueness of role_id scoped to member_id" do
      create(:role_assignment, role: role, member: member)
      
      duplicate_assignment = build(:role_assignment, role: role, member: member)
      expect(duplicate_assignment).not_to be_valid
      expect(duplicate_assignment.errors[:role_id]).to include("Role already assigned to this member")
    end
    
    it "validates that member and role are in the same organization" do
      other_org = create(:organization, name: { en: "Other Org #{SecureRandom.uuid}" })
      other_member = create(:member, organization: other_org)
      
      invalid_assignment = build(:role_assignment, role: role, member: other_member)
      expect(invalid_assignment).not_to be_valid
      expect(invalid_assignment.errors[:base]).to include("Member and Role must be in the same organization")
    end
  end

  describe "associations" do
    it { should belong_to(:role) }
    it { should belong_to(:member) }
  end
  
  describe "callbacks" do
    it "sets start_date before validation on create" do
      time = Time.current.change(sec: 0)
      allow(Time).to receive(:current).and_return(time)
      
      assignment = build(:role_assignment, start_date: nil)
      assignment.valid?
      
      expect(assignment.start_date).to eq(time)
    end
    
    it "doesn't override existing start_date" do
      custom_date = 1.day.ago.change(sec: 0)
      assignment = build(:role_assignment, start_date: custom_date)
      assignment.valid?
      
      expect(assignment.start_date).to eq(custom_date)
    end
  end
  
  describe "scopes" do
    let(:organization) { create(:organization, name: { en: "Scopes Org #{SecureRandom.uuid}" }) }
    let(:role) { create(:role, organization: organization) }
    let(:member) { create(:member, organization: organization) }
    
    let!(:active_assignment) do
      create(:role_assignment, role: role, member: member, finish_date: nil)
    end
    
    let!(:inactive_assignment) do
      create(:role_assignment, role: role, member: member, finish_date: Time.current)
    end
    
    it "returns active assignments" do
      expect(RoleAssignment.active).to include(active_assignment)
      expect(RoleAssignment.active).not_to include(inactive_assignment)
    end
    
    it "returns inactive assignments" do
      expect(RoleAssignment.inactive).to include(inactive_assignment)
      expect(RoleAssignment.inactive).not_to include(active_assignment)
    end
  end
  
  describe "#active?" do
    it "returns true when finish_date is nil" do
      assignment = build(:role_assignment, finish_date: nil)
      expect(assignment.active?).to be true
    end
    
    it "returns false when finish_date is present" do
      assignment = build(:role_assignment, finish_date: Time.current)
      expect(assignment.active?).to be false
    end
  end
end 