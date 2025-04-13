require 'rails_helper'

RSpec.describe Permission, type: :model do
  describe "database schema" do
    it { should have_db_column(:permission_code).of_type(:string).with_options(null: false) }
    it { should have_db_column(:permissionable_type).of_type(:string) }
    it { should have_db_column(:permissionable_id).of_type(:integer) }
    it { should have_db_column(:created_at).of_type(:datetime) }
    it { should have_db_column(:updated_at).of_type(:datetime) }
    
    it { should have_db_index([:permission_code]) }
    it { should have_db_index([:permissionable_type, :permissionable_id]) }
    it { should have_db_index([:organization_id]) }
  end

  describe "validations" do
    it { should validate_presence_of(:permission_code) }
    it { should validate_inclusion_of(:permission_code).in_array(PermissionRegistry.all_codes) }
    it { should validate_presence_of(:permissionable) }
  end

  describe "associations" do
    it { should belong_to(:tenant).optional(false) }
    it { should belong_to(:permissionable) }
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

end 