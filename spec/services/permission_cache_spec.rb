require 'rails_helper'

RSpec.describe PermissionCache do
  let(:tenant) { create(:tenant) }
  let(:user) { create(:user, tenant: tenant) }
  let(:role) { create(:role, tenant: tenant) }
  
  before do
    create(:permission,
      permission_code: "user.read",
      subject: user,
      tenant: tenant
    )
    
    create(:permission,
      permission_code: "user.write",
      subject: role,
      tenant: tenant
    )
    create(:role_assignment, role: role, assignee: user, tenant: tenant)
  end
  
  describe ".fetch_permissions" do
    it "caches user permissions" do
      cache_key = "user_permissions_#{user.id}"
      
      expect(Rails.cache).to receive(:fetch).with(cache_key, any_args).and_call_original
      
      permissions = described_class.fetch_permissions(user)
      
      expect(permissions).to include("user.read")
      expect(permissions).to include("user.write")
    end
    
    it "uses the provided cache options" do
      cache_key = "user_permissions_#{user.id}"
      cache_options = { expires_in: 1.hour }
      
      expect(Rails.cache).to receive(:fetch).with(cache_key, hash_including(cache_options)).and_call_original
      
      described_class.fetch_permissions(user, cache_options)
    end
    
    it "sets default cache options if none provided" do
      cache_key = "user_permissions_#{user.id}"
      default_options = { expires_in: 1.day }
      
      expect(Rails.cache).to receive(:fetch).with(cache_key, hash_including(default_options)).and_call_original
      
      described_class.fetch_permissions(user)
    end
  end
  
  describe ".invalidate_for" do
    it "clears cache for specific user" do
      cache_key = "user_permissions_#{user.id}"
      
      # First cache the permissions
      described_class.fetch_permissions(user)
      
      # Then expect cache to be cleared
      expect(Rails.cache).to receive(:delete).with(cache_key)
      
      described_class.invalidate_for(user)
    end
  end
  
  describe ".fetch_permissions_for_code" do
    it "caches permissions by code" do
      cache_key = "permission_code_user.read_#{tenant.id}"
      
      expect(Rails.cache).to receive(:fetch).with(cache_key, any_args).and_call_original
      
      permissions = described_class.fetch_permissions_for_code("user.read", tenant.id)
      
      expect(permissions).to include(user.id)
    end
  end
  
  describe ".invalidate_for_code" do
    it "clears cache for specific permission code" do
      cache_key = "permission_code_user.read_#{tenant.id}"
      
      # First cache the permissions
      described_class.fetch_permissions_for_code("user.read", tenant.id)
      
      # Then expect cache to be cleared
      expect(Rails.cache).to receive(:delete).with(cache_key)
      
      described_class.invalidate_for_code("user.read", tenant.id)
    end
  end
  
  describe "cache contents" do
    it "returns fresh permissions when new permissions are added" do
      # Initial permission check
      permissions = described_class.fetch_permissions(user)
      expect(permissions).to match_array(["user.read", "user.write"])
      
      # Add a new permission
      create(:permission,
        permission_code: "user.delete",
        subject: user,
        tenant: tenant
      )
      
      # Clear cache
      described_class.invalidate_for(user)
      
      # Get updated permissions
      updated_permissions = described_class.fetch_permissions(user)
      expect(updated_permissions).to match_array(["user.read", "user.write", "user.delete"])
    end
    
    it "returns fresh permissions when permissions are removed" do
      # Initial permission check
      permissions = described_class.fetch_permissions(user)
      expect(permissions).to match_array(["user.read", "user.write"])
      
      # Remove a permission
      Permission.where(permission_code: "user.read", subject: user).destroy_all
      
      # Clear cache
      described_class.invalidate_for(user)
      
      # Get updated permissions
      updated_permissions = described_class.fetch_permissions(user)
      expect(updated_permissions).to match_array(["user.write"])
    end
    
    it "respects expiration dates for permissions" do
      # Add an expired permission
      create(:permission,
        permission_code: "user.delete",
        subject: user,
        tenant: tenant,
        expires_at: 1.day.ago
      )
      
      # Get permissions
      permissions = described_class.fetch_permissions(user)
      expect(permissions).not_to include("user.delete")
    end
  end
end 