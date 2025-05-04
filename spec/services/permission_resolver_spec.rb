require 'rails_helper'

RSpec.describe PermissionResolver do
  let(:tenant) { create(:tenant) }
  let(:user) { create(:user, tenant: tenant) }
  let(:resolver) { described_class.new(user) }
  
  describe "#can?" do
    context "with direct permission" do
      let(:target) { create(:user, tenant: tenant) }
      
      before do
        create(:permission,
          permission_code: "user.read",
          subject: user,
          target: target,
          tenant: tenant
        )
      end
      
      it "returns true when user has direct permission" do
        expect(resolver.can?("user.read", target)).to be true
      end
      
      it "returns false for a different permission code" do
        expect(resolver.can?("user.write", target)).to be false
      end
      
      it "returns false when permission is expired" do
        expired_permission = create(:permission,
          permission_code: "user.write",
          subject: user,
          target: target,
          tenant: tenant,
          expires_at: 1.day.ago
        )
        
        expect(resolver.can?("user.write", target)).to be false
      end
    end
    
    context "with role-based permission" do
      let(:role) { create(:role, tenant: tenant) }
      let(:target) { nil } # Global permission
      
      before do
        create(:permission,
          permission_code: "user.read",
          subject: role,
          tenant: tenant
        )
        create(:role_assignment, role: role, assignee: user, tenant: tenant)
      end
      
      it "returns true when user has permission through role" do
        expect(resolver.can?("user.read")).to be true
      end
      
      it "returns false for a different permission code" do
        expect(resolver.can?("user.write")).to be false
      end
      
      it "returns false when role assignment is expired" do
        role_with_write = create(:role, tenant: tenant)
        create(:permission,
          permission_code: "user.write",
          subject: role_with_write,
          tenant: tenant
        )
        create(:role_assignment,
          role: role_with_write,
          assignee: user,
          tenant: tenant,
          expires_at: 1.day.ago
        )
        
        expect(resolver.can?("user.write")).to be false
      end
    end
    
    context "with group-based permission" do
      let(:group) { create(:group, tenant: tenant) }
      
      before do
        create(:permission,
          permission_code: "user.read",
          subject: group,
          tenant: tenant
        )
        group.add_user(user)
      end
      
      it "returns true when user has permission through group" do
        expect(resolver.can?("user.read")).to be true
      end
      
      it "returns false for a different permission code" do
        expect(resolver.can?("user.write")).to be false
      end
    end
    
    context "with department-based permission" do
      let(:department) { create(:department, tenant: tenant) }
      
      before do
        create(:permission,
          permission_code: "user.read",
          subject: department,
          tenant: tenant
        )
        department.add_user(user)
      end
      
      it "returns true when user has permission through department" do
        expect(resolver.can?("user.read")).to be true
      end
      
      it "returns false for a different permission code" do
        expect(resolver.can?("user.write")).to be false
      end
    end
    
    context "with role hierarchy" do
      let(:parent_role) { create(:role, name: 'Parent', tenant: tenant) }
      let(:child_role) { create(:role, name: 'Child', parent: parent_role, tenant: tenant) }
      
      before do
        create(:permission,
          permission_code: "user.read",
          subject: parent_role,
          tenant: tenant
        )
        create(:role_assignment, role: child_role, assignee: user, tenant: tenant)
      end
      
      it "returns true when user has permission through role hierarchy" do
        expect(resolver.can?("user.read")).to be true
      end
    end
    
    context "with target-specific permissions" do
      let(:target_a) { create(:user, tenant: tenant) }
      let(:target_b) { create(:user, tenant: tenant) }
      let(:role) { create(:role, tenant: tenant) }
      
      before do
        create(:permission,
          permission_code: "user.read",
          subject: role,
          target: target_a,
          tenant: tenant
        )
        create(:role_assignment, role: role, assignee: user, tenant: tenant)
      end
      
      it "returns true for the specific target" do
        expect(resolver.can?("user.read", target_a)).to be true
      end
      
      it "returns false for a different target" do
        expect(resolver.can?("user.read", target_b)).to be false
      end
    end
    
    context "with multiple permission sources" do
      let(:role) { create(:role, tenant: tenant) }
      let(:group) { create(:group, tenant: tenant) }
      let(:target) { create(:user, tenant: tenant) }
      
      it "returns true if permission exists from any source" do
        # No permissions initially
        expect(resolver.can?("user.read", target)).to be false
        
        # Add role-based permission
        create(:permission,
          permission_code: "user.read",
          subject: role,
          tenant: tenant
        )
        create(:role_assignment, role: role, assignee: user, tenant: tenant)
        
        expect(resolver.can?("user.read", target)).to be true
        
        # Even if we add a contradicting group permission (with different target)
        create(:permission,
          permission_code: "user.read",
          subject: group,
          target: create(:user, tenant: tenant), # Different target
          tenant: tenant
        )
        group.add_user(user)
        
        # We should still have permission through the role
        expect(resolver.can?("user.read", target)).to be true
      end
    end
  end

  describe "#permissions_for" do
    let(:role) { create(:role, tenant: tenant) }
    let(:group) { create(:group, tenant: tenant) }
    let(:department) { create(:department, tenant: tenant) }
    let(:target) { create(:user, tenant: tenant) }
    
    before do
      # Direct permission
      create(:permission,
        permission_code: "user.read",
        subject: user,
        target: target,
        tenant: tenant
      )
      
      # Role permission
      create(:permission,
        permission_code: "user.create",
        subject: role,
        tenant: tenant
      )
      create(:role_assignment, role: role, assignee: user, tenant: tenant)
      
      # Group permission
      create(:permission,
        permission_code: "user.update",
        subject: group,
        tenant: tenant
      )
      group.add_user(user)
      
      # Department permission
      create(:permission,
        permission_code: "user.delete",
        subject: department,
        tenant: tenant
      )
      department.add_user(user)
    end
    
    it "collects all permissions for a user" do
      permissions = resolver.permissions_for
      
      expect(permissions).to include("user.read")
      expect(permissions).to include("user.create")
      expect(permissions).to include("user.update")
      expect(permissions).to include("user.delete")
    end
    
    it "filters by permission category" do
      # Assuming these are categorized correctly in PermissionRegistry
      user_permissions = resolver.permissions_for(category: :user_management)
      
      expect(user_permissions).to include("user.read")
      expect(user_permissions).to include("user.create")
      expect(user_permissions).to include("user.update")
      expect(user_permissions).to include("user.delete")
      
      # Shouldn't include permissions from other categories
      expect(user_permissions).not_to include("role.read") if PermissionRegistry.all_codes.include?("role.read")
    end
    
    it "filters by target" do
      target_permissions = resolver.permissions_for(target: target)
      
      expect(target_permissions).to include("user.read") # Direct permission for target
      expect(target_permissions).not_to include("user.create") # Global permission
    end
  end

  describe "#tenant_consistency" do
    let(:other_tenant) { create(:tenant) }
    let(:other_tenant_target) { create(:user, tenant: other_tenant) }
    
    it "respects tenant boundaries" do
      # Create permission in user's tenant
      create(:permission,
        permission_code: "user.read",
        subject: user,
        target: other_tenant_target, # Target from different tenant
        tenant: tenant
      )
      
      # Should not allow access across tenant boundaries
      expect(resolver.can?("user.read", other_tenant_target)).to be false
    end
  end
  
  describe "caching" do
    let(:cache_key) { "user_permissions_#{user.id}" }
    
    it "caches permission checks" do
      allow(Rails.cache).to receive(:fetch).and_call_original
      
      # First call should try to fetch from cache
      resolver.can?("user.read")
      
      expect(Rails.cache).to have_received(:fetch).with(cache_key, any_args)
    end
    
    it "invalidates cache when permissions change" do
      # Warm up the cache
      expect(resolver.can?("user.read")).to be false
      
      # Cache should be invalidated when a new permission is added
      allow(Rails.cache).to receive(:delete).and_call_original
      
      create(:permission,
        permission_code: "user.read",
        subject: user,
        tenant: tenant
      )
      
      # Permission change should trigger cache invalidation
      expect(Rails.cache).to have_received(:delete).with(cache_key)
      
      # New permission should be reflected
      expect(resolver.can?("user.read")).to be true
    end
  end
end 