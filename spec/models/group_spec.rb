require 'rails_helper'

RSpec.describe Group, type: :model do
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
      group1 = create(:group, organization: organization)
      group2 = build(:group, name: group1.name, organization: organization)
      expect(group2).not_to be_valid
      expect(group2.errors[:name]).to include(/has already been taken/)
    end
  end

  describe "associations" do
    it { should belong_to(:organization).optional(false) }
    it { should have_and_belong_to_many(:members) }
    it { should have_many(:permissions).as(:subject) }
  end

  describe "PaperTrail" do
    it { should be_versioned }
    
    it "tracks changes to group attributes" do
      group = create(:group)
      
      expect {
        group.update(name: { en: 'Updated Group Name' })
      }.to change { group.versions.count }.by(1)
      
      expect(group.versions.last.changeset).to have_key("name")
    end
  end
  
  describe "#add_member" do
    let(:group) { create(:group) }
    let(:member) { create(:member) }
    
    it "adds a member to the group" do
      expect {
        group.add_member(member)
      }.to change { group.members.count }.by(1)
      
      expect(group.members).to include(member)
    end
    
    it "doesn't add the same member twice" do
      group.add_member(member)
      
      expect {
        group.add_member(member)
      }.not_to change { group.members.count }
    end
  end
  
  describe "#remove_member" do
    let(:group) { create(:group) }
    let(:member) { create(:member) }
    
    before do
      group.add_member(member)
    end
    
    it "removes a member from the group" do
      expect {
        group.remove_member(member)
      }.to change { group.members.count }.by(-1)
      
      expect(group.members).not_to include(member)
    end
    
    it "does nothing if member is not in group" do
      group.remove_member(member)
      
      expect {
        group.remove_member(member)
      }.not_to change { group.members.count }
    end
  end
  
  describe "#member_in_group?" do
    let(:group) { create(:group) }
    let(:member) { create(:member) }
    let(:other_member) { create(:member) }
    
    before do
      group.add_member(member)
    end
    
    it "returns true if member is in group" do
      expect(group.member_in_group?(member)).to be true
    end
    
    it "returns false if member is not in group" do
      expect(group.member_in_group?(other_member)).to be false
    end
  end
end 