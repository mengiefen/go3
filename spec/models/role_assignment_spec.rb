require 'rails_helper'

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
  end

  describe "validations" do
    it { should validate_presence_of(:role_id) }
    it { should validate_presence_of(:member_id) }
    it { should validate_presence_of(:start_date) }
    
    describe "validating single active assignment per role" do
      let(:organization) { create(:organization) }
      let(:role) { create(:role, organization: organization) }
      let(:member1) { create(:member, organization: organization) }
      let(:member2) { create(:member, organization: organization) }
      
      before do
        create(:role_assignment, role: role, member: member1)
      end
      
      it "prevents multiple active assignments for the same role" do
        assignment = build(:role_assignment, role: role, member: member2)
        expect(assignment).not_to be_valid
        expect(assignment.errors[:base]).to include("There is already an active assignment for this role")
      end
      
      it "allows inactive assignments for the same role" do
        assignment = build(:role_assignment, role: role, member: member2, finish_date: Time.current)
        expect(assignment).to be_valid
      end
      
      it "allows active assignments for different roles" do
        other_role = create(:role, organization: organization)
        assignment = build(:role_assignment, role: other_role, member: member2)
        expect(assignment).to be_valid
      end
    end
  end

  describe "associations" do
    it { should belong_to(:role) }
    it { should belong_to(:member) }
  end
  
  describe "scopes" do
    let(:organization) { create(:organization) }
    let(:role) { create(:role, organization: organization) }
    let(:member) { create(:member, organization: organization) }
    let!(:active_assignment) { create(:role_assignment, role: role, member: member) }
    let!(:inactive_assignment) { create(:role_assignment, :inactive, role: role, member: member) }
    let!(:other_assignment) { create(:role_assignment) }
    
    it "should return active assignments" do
      expect(RoleAssignment.active).to include(active_assignment)
      expect(RoleAssignment.active).not_to include(inactive_assignment)
    end
    
    it "should return inactive assignments" do
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