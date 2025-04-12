require 'rails_helper'

RSpec.describe Permission, type: :model do
  describe "database schema" do
    it { should have_db_column(:permission_code).of_type(:string).with_options(null: false) }
    it { should have_db_column(:subject_type).of_type(:string) }
    it { should have_db_column(:subject_id).of_type(:integer) }
    it { should have_db_column(:target_type).of_type(:string) }
    it { should have_db_column(:target_id).of_type(:integer) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    it { should have_db_column(:expires_at).of_type(:datetime) }
    it { should have_db_column(:tenant_id).of_type(:integer) }
    
    it { should have_db_index([:permission_code]) }
    it { should have_db_index([:subject_type, :subject_id]) }
    it { should have_db_index([:target_type, :target_id]) }
    it { should have_db_index([:tenant_id]) }
  end

  describe "validations" do
    it { should validate_presence_of(:permission_code) }
    it { should validate_inclusion_of(:permission_code).in_array(PermissionRegistry.all_codes) }
  end

  describe "associations" do
    it { should belong_to(:tenant).optional(false) }
    it { should belong_to(:subject).polymorphic.optional(true) }
    it { should belong_to(:target).polymorphic.optional(true) }
  end

  describe "scopes" do
    let(:tenant) { create(:tenant) }
    let!(:active_permission) { create(:permission, tenant: tenant) }
    let!(:expired_permission) { create(:permission, tenant: tenant, expires_at: 1.day.ago) }
    let!(:other_tenant_permission) { create(:permission) }

    it "should scope by active permissions" do
      expect(Permission.active).to include(active_permission)
      expect(Permission.active).not_to include(expired_permission)
    end
    
    it "should scope by tenant" do
      expect(Permission.for_tenant(tenant.id)).to include(active_permission)
      expect(Permission.for_tenant(tenant.id)).to include(expired_permission)
      expect(Permission.for_tenant(tenant.id)).not_to include(other_tenant_permission)
    end
  end

  describe "PaperTrail" do
    it { should be_versioned }
    
    it "tracks changes to permission attributes" do
      permission = create(:permission)
      
      expect {
        permission.update(permission_code: PermissionRegistry.all_codes.last)
      }.to change { permission.versions.count }.by(1)
      
      expect(permission.versions.last.changeset).to have_key("permission_code")
    end
  end

  describe "#expired?" do
    it "returns true when expiration date is in the past" do
      permission = build(:permission, expires_at: 1.day.ago)
      expect(permission.expired?).to be true
    end
    
    it "returns false when expiration date is in the future" do
      permission = build(:permission, expires_at: 1.day.from_now)
      expect(permission.expired?).to be false
    end
    
    it "returns false when no expiration date is set" do
      permission = build(:permission, expires_at: nil)
      expect(permission.expired?).to be false
    end
  end
end 