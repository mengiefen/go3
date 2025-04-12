require 'rails_helper'

RSpec.describe PermissionRegistry do
  describe ".all_codes" do
    it "returns all registered permission codes" do
      expect(PermissionRegistry.all_codes).to be_an(Array)
      expect(PermissionRegistry.all_codes).not_to be_empty
      expect(PermissionRegistry.all_codes).to all(be_a(String))
    end
    
    it "includes permissions from all categories" do
      # Get all permissions from each category and compare with all_codes
      all_from_categories = PermissionRegistry.categories.flat_map do |category|
        PermissionRegistry.permissions_for_category(category)
      end
      
      expect(PermissionRegistry.all_codes.sort).to eq(all_from_categories.sort)
    end
  end

  describe ".valid_code?" do
    it "returns true for valid permission codes" do
      valid_code = PermissionRegistry.all_codes.first
      expect(PermissionRegistry.valid_code?(valid_code)).to be true
    end
    
    it "returns false for invalid permission codes" do
      expect(PermissionRegistry.valid_code?("invalid.permission.code")).to be false
    end
    
    it "returns false for nil or empty strings" do
      expect(PermissionRegistry.valid_code?(nil)).to be false
      expect(PermissionRegistry.valid_code?('')).to be false
    end
  end

  describe ".categories" do
    it "returns all permission categories" do
      expect(PermissionRegistry.categories).to be_an(Array)
      expect(PermissionRegistry.categories).not_to be_empty
      expect(PermissionRegistry.categories).to all(be_a(Symbol))
    end
    
    it "includes expected categories" do
      expected_categories = [
        :admin,
        :user_management,
        :role_management,
        :organization
        # Add other expected categories here
      ]
      
      # We only need to check that the expected categories are included,
      # as there might be more categories in the actual implementation
      expected_categories.each do |category|
        expect(PermissionRegistry.categories).to include(category)
      end
    end
  end

  describe ".permissions_for_category" do
    it "returns permissions for a specific category" do
      category = PermissionRegistry.categories.first
      permissions = PermissionRegistry.permissions_for_category(category)
      
      expect(permissions).to be_an(Array)
      expect(permissions).not_to be_empty
      expect(permissions).to all(be_a(String))
    end
    
    it "returns empty array for non-existent category" do
      expect(PermissionRegistry.permissions_for_category(:non_existent)).to eq([])
    end
  end

  describe ".permission_metadata" do
    let(:permission_code) { PermissionRegistry.all_codes.first }
    
    it "returns metadata for a specific permission" do
      metadata = PermissionRegistry.permission_metadata(permission_code)
      
      expect(metadata).to be_a(Hash)
      expect(metadata).to have_key(:label)
      expect(metadata).to have_key(:description)
      expect(metadata).to have_key(:category)
    end
    
    it "raises error for invalid permission code" do
      expect {
        PermissionRegistry.permission_metadata("invalid.permission.code")
      }.to raise_error(ArgumentError, /not a valid permission code/)
    end
  end

  describe ".permission_label" do
    let(:permission_code) { PermissionRegistry.all_codes.first }
    
    it "returns human-readable label for permission" do
      label = PermissionRegistry.permission_label(permission_code)
      
      expect(label).to be_a(String)
      expect(label).not_to eq(permission_code) # Label should be more user-friendly than the code
    end
    
    it "raises error for invalid permission code" do
      expect {
        PermissionRegistry.permission_label("invalid.permission.code")
      }.to raise_error(ArgumentError, /not a valid permission code/)
    end
  end

  describe ".category_label" do
    let(:category) { PermissionRegistry.categories.first }
    
    it "returns human-readable label for category" do
      label = PermissionRegistry.category_label(category)
      
      expect(label).to be_a(String)
      expect(label).not_to eq(category.to_s) # Label should be more user-friendly than the symbol
    end
    
    it "raises error for invalid category" do
      expect {
        PermissionRegistry.category_label(:invalid_category)
      }.to raise_error(ArgumentError, /not a valid category/)
    end
  end
end 