namespace :test do
  desc "Test factories for Organization, Member, Group, Role, and RoleAssignment models"
  task :factories => :environment do
    require 'factory_bot'
    
    begin
      # Create an organization
      org = FactoryBot.build(:organization)
      puts "Organization: #{org.name.inspect}"
      puts "Valid: #{org.valid?}"
      puts "Errors: #{org.errors.full_messages}" unless org.valid?
      org.save!
      
      # Create a member in that organization
      member = FactoryBot.build(:member, organization: org)
      puts "\nMember: #{member.email}"
      puts "Valid: #{member.valid?}"
      puts "Errors: #{member.errors.full_messages}" unless member.valid?
      member.save!
      
      # Create a group in that organization
      group = FactoryBot.build(:group, organization: org)
      puts "\nGroup: #{group.name.inspect}"
      puts "Valid: #{group.valid?}"
      puts "Errors: #{group.errors.full_messages}" unless group.valid?
      group.save!
      
      # Add member to group
      group.add_member(member)
      puts "\nMember in group: #{group.member_in_group?(member)}"
      puts "Group members count: #{group.members.count}"
      
      # Create a department
      department = FactoryBot.build(:department, organization: org)
      puts "\nDepartment: #{department.name.inspect}"
      puts "Valid: #{department.valid?}"
      puts "Errors: #{department.errors.full_messages}" unless department.valid?
      department.save!
      
      # Create a role in that organization
      role = FactoryBot.build(:role, organization: org, department: department)
      puts "\nRole: #{role.name.inspect}"
      puts "Valid: #{role.valid?}"
      puts "Errors: #{role.errors.full_messages}" unless role.valid?
      role.save!
      
      # Assign member to role
      role.assign_member(member)
      puts "\nRole assignment successful: #{role.member == member}"
      puts "Role's current member: #{role.member.email if role.member}"
      
      # Create a role assignment directly
      role_assignment = FactoryBot.build(:role_assignment, role: role, assignee: member, organization: org)
      puts "\nRole Assignment: from #{role_assignment.role.name.inspect} to #{role_assignment.assignee.email}"
      puts "Valid: #{role_assignment.valid?}"
      puts "Errors: #{role_assignment.errors.full_messages}" unless role_assignment.valid?
      
      # Create group with members
      group_with_members = FactoryBot.create(:group, :with_members, members_count: 2, organization: org)
      puts "\nGroup with members: #{group_with_members.name.inspect}"
      puts "Members count: #{group_with_members.members.count}"
      
      puts "\nAll factories passed!"
    rescue => e
      puts "Error: #{e.message}"
      puts e.backtrace.join("\n")
    end
  end
end 