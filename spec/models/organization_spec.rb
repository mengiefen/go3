require 'rails_helper'

RSpec.describe Organization, type: :model do
  describe "database schema" do
    it { should have_db_column(:name).of_type(:jsonb).with_options(null: false) }
    it { should have_db_column(:description).of_type(:jsonb) }
    it { should have_db_column(:parent_id).of_type(:integer) }
    it { should have_db_column(:is_tenant).of_type(:boolean) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index(:name).using(:gin) }
    it { should have_db_index([:parent_id]) }
    it { should have_db_index([:tenant_id]) }
  end

  describe "validations" do
    it { should validate_presence_of(:name) }
    
    it "validates uniqueness of name within tenant scope" do
      tenant = create(:tenant)
      org1 = create(:organization, tenant: tenant)
      org2 = build(:organization, name: org1.name, tenant: tenant)
      expect(org2).not_to be_valid
      expect(org2.errors[:name]).to include(/has already been taken/)
    end

    let(:tenant) { create(:tenant) }
    
    it "validates that name contains at least one translation" do
      organization = Organization.new(tenant: tenant, name: {})
      expect(organization).not_to be_valid
      expect(organization.errors[:name]).to include("must contain at least one translation")
    end
    
    it "is valid with a name containing at least one translation" do
      organization = Organization.new(tenant: tenant, name: { en: "Marketing" })
      expect(organization).to be_valid
    end
  end

  describe "associations" do
    it { should belong_to(:parent).class_name('Organization').optional(true) }
    it { should have_many(:children).class_name('Organization').with_foreign_key('parent_id') }
    it { should have_many(:departments) }
    it { should have_many(:groups) }
    it { should have_many(:roles) }
    it { should have_many(:members).class_name('User') }
  end

  describe "hierarchy" do
    let(:tenant) { create(:tenant) }
    let(:grandparent) { create(:organization, name: { en: 'Executive' }, tenant: tenant) }
    let(:parent) { create(:organization, name: { en: 'Engineering' }, parent: grandparent, tenant: tenant) }
    let(:child) { create(:organization, name: { en: 'Backend' }, parent: parent, tenant: tenant) }
    
    it "builds correct ancestry chain" do
      expect(child.ancestor_chain).to eq([child, parent, grandparent])
    end
    
    it "prevents circular references" do
      grandparent.parent = child
      expect(grandparent).not_to be_valid
      expect(grandparent.errors[:parent_id]).to include(/circular reference/)
    end
  end

  describe "PaperTrail" do
    it { should be_versioned }
    
    it "tracks changes to organization attributes" do
      organization = create(:organization)
      
      expect {
        organization.update(name: { en: 'Updated Organization Name' })
      }.to change { organization.versions.count }.by(1)
      
      expect(organization.versions.last.changeset).to have_key("name")
    end
  end

  describe "scopes" do
    it "returns organizations for a specific tenant" do     
      organization1 = create(:organization, is_tenant: true)
      organization2 = create(:organization, parent: organization1)
      organization3 = create(:organization, parent: organization1)
      
      expect(organization1.children).to include(organization2, organization3)
    end
  end
end 