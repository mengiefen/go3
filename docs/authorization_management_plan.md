# Authorization Management Plan

## Overview

This document outlines the action plan for implementing a robust, scalable authorization system based on the requirements specified. The plan incorporates industry best practices for permission management in multi-tenant applications with complex organizational structures.

## Research Findings

After researching authorization best practices, particularly for systems with hierarchical permissions across organizations, the following key principles should guide our implementation:

1. **Principle of Least Privilege**: Users should only have the minimum permissions necessary to perform their tasks.
2. **Separation of Concerns**: Clear distinction between permission definition, assignment, and enforcement.
3. **Audit Trail**: Complete history of permission changes with detailed metadata.
4. **Performance Optimization**: Caching and efficient permission resolution to minimize database queries.
5. **Consistent API**: A unified interface for permission checks across the application.
6. **Database-Level Security**: Implementing Row-Level Security at the database level as an additional layer of protection.
7. **Tenant Isolation**: Ensuring strict isolation of data between different organizations.

## Requirements Clarification

Based on the provided responses and additional research, we have clarified the following aspects:

1. **Resources and Actions**
   - We will create a code-defined permission registry that defines all protected entities and possible actions
   - Each resource will have a defined set of actions that can be permitted

2. **Role Hierarchy**
   - Roles are both organization-specific (CEO, finance, manager) and platform-specific (Super admin, admin).
   - Roles have a hierarchical structure (e.g., CEO > Finance manager > accountant).
   - Each role is assigned to a member. Assignment history should be tracked.
   - Role assignment requires permission, with organization admins having this permission by default.

3. **Permission Model**
   - No explicit denial mechanism - permissions are granted or not granted.
   - Multiple permission sources (direct, group, department, role) are additive.
   - When revoking a permission, the system should warn if the user will still have access through other means.

4. **Permission Inheritance**
   - Permissions are not automatically inherited through role hierarchies.
   - Each permission must be explicitly granted to relevant entities.

5. **Temporary Permissions**
   - Time-limited permissions with automatic expiration are supported.
   - Expiring permissions trigger notifications to grantees.
   - Permission delegation is controlled by a "delegatable" flag on resources/actions.

## Action Plan

### Phase 1: Foundation (2-3 weeks)

1. **Database Schema Design**
   - Create tables for permissions, roles, and permission assignments
   - Implement polymorphic relationships for permission subjects and targets
   - Design schema for permission history/auditing
   - Implement tenant isolation with proper foreign key constraints
   - Set up PostgreSQL Row-Level Security policies for tenant isolation

2. **Core Permission Models**
   - Implement Permission model referencing permission codes 
   - Create code-defined permission registry
   - Leverage PaperTrail for tracking changes to permission entities
   - Implement expiration logic for temporary permissions

3. **Pundit Policy Framework**
   - Design base ApplicationPolicy with permission checking methodology
   - Create resource-specific policies inheriting from base policy
   - Implement permission resolution with caching
   - Create role-specific policy contexts for more maintainable code

### Phase 2: Authorization Logic (2-3 weeks)

1. **Permission Resolution Engine**
   - Implement algorithm to resolve effective permissions from multiple sources (direct, group, department, role)
   - Optimize query performance for permission checks with proper indexing
   - Develop warning system for cases where permissions still exist through alternative paths

2. **Permission Assignment System**
   - Build interfaces for assigning permissions to entities
   - Implement validation rules to ensure proper tenant isolation
   - Create mechanisms for time-limited permission grants

3. **History Tracking**
   - Configure PaperTrail to track all permission-related models
   - Store metadata including who made changes, when, and why
   - Create pruning/archiving strategy for historical data
   - Build custom queries and views for auditing permission changes

### Phase 3: API and UI (2 weeks)

1. **Authorization API**
   - Create consistent API for permission checks
   - Implement helper methods for common permission patterns
   - Build batch permission verification for UI rendering
   - Develop tenant-aware context handling

2. **Admin Interfaces**
   - Design UI for managing permissions across entities
   - Create visualizations for permission sources
   - Implement audit logs and history views
   - Develop permission impact analysis tool to show effect of changes

### Phase 4: Testing and Optimization (1-2 weeks)

1. **Comprehensive Testing**
   - Unit tests for permission resolution logic
   - Integration tests for policy enforcement
   - Performance testing under load
   - Security-focused penetration testing

2. **Optimization**
   - Implement caching strategies
   - Optimize database queries with proper indexes
   - Create maintenance tasks for permission system health

## Recommended Architecture

Based on the requirements and best practices, we recommend implementing:

1. **Code-Defined Permission Registry**: Central definition of all available permissions in code
2. **Multi-source Permission Resolution**: Algorithm that checks all possible sources of a permission
3. **Permission Caching**: In-memory cache of resolved permissions for performance
4. **Change Tracking**: Event-based system to track all permission changes
5. **Pundit Integration**: Leverage Pundit's policy-based approach while extending it for our complex needs
6. **Database-Level Security**: Implement PostgreSQL Row-Level Security as an additional layer of protection

## Tools and Libraries

1. **Pundit**: For policy definition and enforcement
2. **PaperTrail**: For tracking permission history
3. **Redis**: For permission cache
4. **PostgreSQL**: Using Row-Level Security for tenant isolation
5. **GraphQL**: For efficient permission querying (optional)

## Conclusion

The authorization system as currently specified provides a solid foundation for a robust, maintainable, and scalable permission management system. With the clarifications provided, we can implement a system that supports complex organizational structures while maintaining performance and auditability.

The system will focus primarily on organization permissions that are limited to a single organization, with platform permissions handled separately. This separation of concerns will help maintain system clarity and efficiency.

Key success factors will include:
1. Strict tenant isolation enforced at both application and database levels
2. Comprehensive audit trails for all permission changes using PaperTrail
3. Efficient caching to maintain performance at scale
4. Clear, consistent API for permission checks throughout the application

### Note on History Tracking

Rather than implementing a custom PermissionHistory model, we will leverage PaperTrail to handle change tracking for all permission-related models. PaperTrail offers several advantages:

1. Automatic tracking of all model changes with minimal code
2. Built-in support for who/when/what metadata
3. Flexible querying capabilities for audit purposes
4. Integration with ActiveRecord callbacks

This approach simplifies the codebase while still maintaining comprehensive audit capabilities. For specific permission-related audit views or reports, we'll build these on top of the PaperTrail data model rather than maintaining a separate history structure.

## Model Structure

### Permission Registry Module

Instead of a database model, we'll define permissions in code using a registry pattern:

```ruby
# app/lib/permission_registry.rb
module PermissionRegistry
  # Define resource categories
  RESOURCES = {
    project: {
      name: "Projects",
      actions: {
        view: { name: "View projects", delegatable: true },
        create: { name: "Create projects", delegatable: false },
        update: { name: "Edit projects", delegatable: true },
        delete: { name: "Delete projects", delegatable: false }
      }
    },
    document: {
      name: "Documents",
      actions: {
        view: { name: "View documents", delegatable: true },
        create: { name: "Create documents", delegatable: true },
        update: { name: "Edit documents", delegatable: true },
        delete: { name: "Delete documents", delegatable: false }
      }
    },
    # Add more resources as needed
  }
  
  # Helper methods to work with the registry
  def self.all_permissions
    @all_permissions ||= begin
      RESOURCES.flat_map do |resource_key, resource_config|
        resource_config[:actions].map do |action_key, action_config|
          "#{resource_key}:#{action_key}"
        end
      end
    end
  end
  
  def self.valid_permission?(permission_code)
    all_permissions.include?(permission_code)
  end
  
  def self.humanize(permission_code)
    resource_key, action_key = permission_code.split(':').map(&:to_sym)
    return nil unless RESOURCES[resource_key] && RESOURCES[resource_key][:actions][action_key]
    
    "#{RESOURCES[resource_key][:actions][action_key][:name]} (#{RESOURCES[resource_key][:name]})"
  end
  
  def self.delegatable?(permission_code)
    resource_key, action_key = permission_code.split(':').map(&:to_sym)
    return false unless RESOURCES[resource_key] && RESOURCES[resource_key][:actions][action_key]
    
    RESOURCES[resource_key][:actions][action_key][:delegatable] || false
  end
end
```

### Permission Model

**Fields:**
- `id`: Primary key
- `permission_code`: String (e.g., "project:view", "document:edit")
- `subject_type`: String (polymorphic - "Member", "Group", "Role", "Department")
- `subject_id`: Integer (polymorphic - ID of the member, group, etc.)
- `target_type`: String (polymorphic - optional, for record-specific permissions)
- `target_id`: Integer (polymorphic - optional, for record-specific permissions)
- `expires_at`: DateTime (for temporary permissions)
- `created_by_id`: Foreign key to User who granted the permission
- `timestamps`: created_at, updated_at

**Associations:**
```ruby
class Permission < ApplicationRecord
  belongs_to :subject, polymorphic: true
  belongs_to :target, polymorphic: true, optional: true
  belongs_to :created_by, class_name: 'User'
  
  # Validation
  validates :permission_code, presence: true
  validate :validate_permission_code
  validate :validate_expiration_date
  
  # Scopes
  scope :active, -> { where('expires_at IS NULL OR expires_at > ?', Time.current) }
  scope :for_code, ->(code) { where(permission_code: code) }
  
  # Methods
  def expired?
    expires_at.present? && expires_at <= Time.current
  end
  
  def delegatable?
    PermissionRegistry.delegatable?(permission_code)
  end
  
  def humanized_permission
    PermissionRegistry.humanize(permission_code)
  end
  
  private
  
  def validate_permission_code
    errors.add(:permission_code, "is not a valid permission") unless PermissionRegistry.valid_permission?(permission_code)
  end
  
  def validate_expiration_date
    errors.add(:expires_at, "must be in the future") if expires_at.present? && expires_at <= Time.current
  end
end
``` 