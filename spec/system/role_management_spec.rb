require 'rails_helper'

RSpec.describe "Role Management", type: :system do
  let(:tenant) { create(:tenant) }
  
  let(:admin) do
    user = create(:user, tenant: tenant)
    admin_role = create(:role, name: 'Admin', tenant: tenant)
    create(:permission, permission_code: 'role.manage', subject: admin_role, tenant: tenant)
    create(:role_assignment, role: admin_role, assignee: user, tenant: tenant)
    user
  end

  before do
    driven_by(:rack_test)
    sign_in admin
  end

  describe "index page" do
    let!(:role1) { create(:role, name: "Editor", tenant: tenant) }
    let!(:role2) { create(:role, name: "Viewer", tenant: tenant) }
    
    it "displays all roles" do
      visit admin_roles_path
      
      expect(page).to have_content("Roles")
      expect(page).to have_content(role1.name)
      expect(page).to have_content(role2.name)
    end
    
    it "allows navigation to role details" do
      visit admin_roles_path
      
      click_link role1.name
      
      expect(current_path).to eq(admin_role_path(role1))
      expect(page).to have_content(role1.name)
    end
    
    it "allows navigation to create new role" do
      visit admin_roles_path
      
      click_link "New Role"
      
      expect(current_path).to eq(new_admin_role_path)
    end
  end
  
  describe "show page" do
    let(:role) { create(:role, name: "Editor", description: "Can edit content", tenant: tenant) }
    
    it "displays role details" do
      visit admin_role_path(role)
      
      expect(page).to have_content(role.name)
      expect(page).to have_content(role.description)
    end
    
    it "allows navigation to edit page" do
      visit admin_role_path(role)
      
      click_link "Edit"
      
      expect(current_path).to eq(edit_admin_role_path(role))
    end
    
    it "allows role deletion" do
      visit admin_role_path(role)
      
      expect {
        accept_confirm do
          click_link "Delete"
        end
      }.to change(Role, :count).by(-1)
      
      expect(current_path).to eq(admin_roles_path)
      expect(page).to have_content("Role was successfully deleted")
    end
  end
  
  describe "new page" do
    it "allows creation of a new role" do
      visit new_admin_role_path
      
      fill_in "Name", with: "Test Role"
      fill_in "Description", with: "Test Description"
      
      expect {
        click_button "Create Role"
      }.to change(Role, :count).by(1)
      
      expect(page).to have_content("Role was successfully created")
      expect(page).to have_content("Test Role")
      expect(page).to have_content("Test Description")
    end
    
    it "shows validation errors" do
      visit new_admin_role_path
      
      fill_in "Name", with: ""
      
      click_button "Create Role"
      
      expect(page).to have_content("Name can't be blank")
    end
  end
  
  describe "edit page" do
    let(:role) { create(:role, name: "Editor", description: "Can edit content", tenant: tenant) }
    
    it "allows updating a role" do
      visit edit_admin_role_path(role)
      
      fill_in "Name", with: "Updated Role"
      fill_in "Description", with: "Updated Description"
      
      click_button "Update Role"
      
      expect(page).to have_content("Role was successfully updated")
      expect(page).to have_content("Updated Role")
      expect(page).to have_content("Updated Description")
    end
    
    it "shows validation errors" do
      visit edit_admin_role_path(role)
      
      fill_in "Name", with: ""
      
      click_button "Update Role"
      
      expect(page).to have_content("Name can't be blank")
    end
  end
  
  describe "role permissions" do
    let(:role) { create(:role, name: "Editor", tenant: tenant) }
    
    it "allows assigning permissions to a role" do
      visit admin_role_path(role)
      
      click_link "Manage Permissions"
      
      # Assuming there's a checkbox for each permission
      check "user.read"
      check "user.update"
      
      click_button "Update Permissions"
      
      expect(page).to have_content("Permissions were successfully updated")
      
      # Check that permissions were saved
      visit admin_role_path(role)
      expect(page).to have_content("user.read")
      expect(page).to have_content("user.update")
    end
  end
  
  describe "role assignments" do
    let(:role) { create(:role, name: "Editor", tenant: tenant) }
    let!(:user1) { create(:user, first_name: "John", last_name: "Doe", tenant: tenant) }
    let!(:user2) { create(:user, first_name: "Jane", last_name: "Smith", tenant: tenant) }
    
    it "allows assigning users to a role" do
      visit admin_role_path(role)
      
      click_link "Manage Assignments"
      
      # Assuming there's a checkbox or multi-select for users
      select "John Doe", from: "Users"
      
      click_button "Update Assignments"
      
      expect(page).to have_content("Assignments were successfully updated")
      
      # Check that assignment was saved
      visit admin_role_path(role)
      expect(page).to have_content("John Doe")
    end
  end
end 