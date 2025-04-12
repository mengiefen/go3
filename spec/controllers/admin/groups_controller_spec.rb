require 'rails_helper'

RSpec.describe Admin::GroupsController, type: :controller do
  let(:tenant) { create(:tenant) }
  
  let(:admin) do
    user = create(:user, tenant: tenant)
    admin_role = create(:role, name: { en: 'Admin' }, tenant: tenant)
    create(:permission, permission_code: 'group.manage', subject: admin_role, tenant: tenant)
    create(:role_assignment, role: admin_role, assignee: user, tenant: tenant)
    user
  end
  
  let(:manager) do
    user = create(:user, tenant: tenant)
    manager_role = create(:role, name: { en: 'Manager' }, tenant: tenant)
    create(:permission, permission_code: 'group.read', subject: manager_role, tenant: tenant)
    create(:permission, permission_code: 'group.create', subject: manager_role, tenant: tenant)
    create(:permission, permission_code: 'group.update', subject: manager_role, tenant: tenant)
    create(:role_assignment, role: manager_role, assignee: user, tenant: tenant)
    user
  end
  
  let(:regular_user) { create(:user, tenant: tenant) }
  
  let(:valid_attributes) do
    {
      name: { en: 'Engineering' },
      description: { en: 'Engineering team' }
    }
  end
  
  let(:invalid_attributes) do
    {
      name: {},
      description: { en: 'Invalid group without name' }
    }
  end
  
  describe "GET #index" do
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :index
        expect(response).to be_successful
      end
      
      it "lists all groups for current tenant" do
        group1 = create(:group, tenant: tenant)
        group2 = create(:group, tenant: tenant)
        other_tenant_group = create(:group)
        
        get :index
        
        expect(assigns(:groups)).to include(group1, group2)
        expect(assigns(:groups)).not_to include(other_tenant_group)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :index
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :index
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe "GET #show" do
    let(:group) { create(:group, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :show, params: { id: group.id }
        expect(response).to be_successful
      end
      
      it "assigns the requested group" do
        get :show, params: { id: group.id }
        expect(assigns(:group)).to eq(group)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :show, params: { id: group.id }
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :show, params: { id: group.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe "GET #new" do
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :new
        expect(response).to be_successful
      end
      
      it "assigns a new group" do
        get :new
        expect(assigns(:group)).to be_a_new(Group)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :new
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :new
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe "POST #create" do
    context "as admin" do
      before { sign_in admin }
      
      context "with valid params" do
        it "creates a new Group" do
          expect {
            post :create, params: { group: valid_attributes }
          }.to change(Group, :count).by(1)
        end
        
        it "sets the tenant to the current user's tenant" do
          post :create, params: { group: valid_attributes }
          expect(Group.last.tenant).to eq(admin.tenant)
        end
        
        it "redirects to the created group" do
          post :create, params: { group: valid_attributes }
          expect(response).to redirect_to(admin_group_path(Group.last))
        end
      end
      
      context "with invalid params" do
        it "does not create a new Group" do
          expect {
            post :create, params: { group: invalid_attributes }
          }.not_to change(Group, :count)
        end
        
        it "renders the 'new' template" do
          post :create, params: { group: invalid_attributes }
          expect(response).to render_template("new")
        end
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "creates a new Group" do
        expect {
          post :create, params: { group: valid_attributes }
        }.to change(Group, :count).by(1)
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        post :create, params: { group: valid_attributes }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not create a new Group" do
        expect {
          post :create, params: { group: valid_attributes }
        }.not_to change(Group, :count)
      end
    end
  end
  
  describe "GET #edit" do
    let(:group) { create(:group, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :edit, params: { id: group.id }
        expect(response).to be_successful
      end
      
      it "assigns the requested group" do
        get :edit, params: { id: group.id }
        expect(assigns(:group)).to eq(group)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :edit, params: { id: group.id }
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :edit, params: { id: group.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe "PUT #update" do
    let(:group) { create(:group, tenant: tenant) }
    let(:new_attributes) { { name: { en: 'Updated Group' }, description: { en: 'Updated description' } } }
    
    context "as admin" do
      before { sign_in admin }
      
      context "with valid params" do
        it "updates the requested group" do
          put :update, params: { id: group.id, group: new_attributes }
          group.reload
          expect(group.name['en']).to eq('Updated Group')
          expect(group.description['en']).to eq('Updated description')
        end
        
        it "redirects to the group" do
          put :update, params: { id: group.id, group: new_attributes }
          expect(response).to redirect_to(admin_group_path(group))
        end
      end
      
      context "with invalid params" do
        it "does not update the group" do
          old_name = group.name
          put :update, params: { id: group.id, group: invalid_attributes }
          group.reload
          expect(group.name).to eq(old_name)
        end
        
        it "renders the 'edit' template" do
          put :update, params: { id: group.id, group: invalid_attributes }
          expect(response).to render_template("edit")
        end
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "updates the requested group" do
        put :update, params: { id: group.id, group: new_attributes }
        group.reload
        expect(group.name['en']).to eq('Updated Group')
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        put :update, params: { id: group.id, group: new_attributes }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not update the group" do
        old_name = group.name
        put :update, params: { id: group.id, group: new_attributes }
        group.reload
        expect(group.name).to eq(old_name)
      end
    end
  end
  
  describe "DELETE #destroy" do
    let!(:group) { create(:group, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "destroys the requested group" do
        expect {
          delete :destroy, params: { id: group.id }
        }.to change(Group, :count).by(-1)
      end
      
      it "redirects to the groups list" do
        delete :destroy, params: { id: group.id }
        expect(response).to redirect_to(admin_groups_path)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a forbidden response" do
        delete :destroy, params: { id: group.id }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not destroy the group" do
        expect {
          delete :destroy, params: { id: group.id }
        }.not_to change(Group, :count)
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        delete :destroy, params: { id: group.id }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not destroy the group" do
        expect {
          delete :destroy, params: { id: group.id }
        }.not_to change(Group, :count)
      end
    end
  end
end 