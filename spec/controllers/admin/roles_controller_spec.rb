require 'rails_helper'

RSpec.describe Admin::RolesController, type: :controller do
  let(:tenant) { create(:tenant) }
  
  let(:admin) do
    user = create(:user, tenant: tenant)
    admin_role = create(:role, name: { en: 'Admin' }, tenant: tenant)
    create(:permission, permission_code: 'role.manage', subject: admin_role, tenant: tenant)
    create(:role_assignment, role: admin_role, assignee: user, tenant: tenant)
    user
  end
  
  let(:manager) do
    user = create(:user, tenant: tenant)
    manager_role = create(:role, name: { en: 'Manager' }, tenant: tenant)
    create(:permission, permission_code: 'role.read', subject: manager_role, tenant: tenant)
    create(:permission, permission_code: 'role.create', subject: manager_role, tenant: tenant)
    create(:permission, permission_code: 'role.update', subject: manager_role, tenant: tenant)
    create(:role_assignment, role: manager_role, assignee: user, tenant: tenant)
    user
  end
  
  let(:regular_user) { create(:user, tenant: tenant) }
  
  let(:valid_attributes) do
    {
      name: { en: 'Editor' },
      description: { en: 'Can edit content' }
    }
  end
  
  let(:invalid_attributes) do
    {
      name: {},
      description: { en: 'Invalid role without name' }
    }
  end
  
  describe "GET #index" do
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :index
        expect(response).to be_successful
      end
      
      it "lists all roles for current tenant" do
        role1 = create(:role, tenant: tenant)
        role2 = create(:role, tenant: tenant)
        other_tenant_role = create(:role)
        
        get :index
        
        expect(assigns(:roles)).to include(role1, role2)
        expect(assigns(:roles)).not_to include(other_tenant_role)
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
    let(:role) { create(:role, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :show, params: { id: role.id }
        expect(response).to be_successful
      end
      
      it "assigns the requested role" do
        get :show, params: { id: role.id }
        expect(assigns(:role)).to eq(role)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :show, params: { id: role.id }
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :show, params: { id: role.id }
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
      
      it "assigns a new role" do
        get :new
        expect(assigns(:role)).to be_a_new(Role)
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
        it "creates a new Role" do
          expect {
            post :create, params: { role: valid_attributes }
          }.to change(Role, :count).by(1)
        end
        
        it "sets the tenant to the current user's tenant" do
          post :create, params: { role: valid_attributes }
          expect(Role.last.tenant).to eq(admin.tenant)
        end
        
        it "redirects to the created role" do
          post :create, params: { role: valid_attributes }
          expect(response).to redirect_to(admin_role_path(Role.last))
        end
      end
      
      context "with invalid params" do
        it "does not create a new Role" do
          expect {
            post :create, params: { role: invalid_attributes }
          }.not_to change(Role, :count)
        end
        
        it "renders the 'new' template" do
          post :create, params: { role: invalid_attributes }
          expect(response).to render_template("new")
        end
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "creates a new Role" do
        expect {
          post :create, params: { role: valid_attributes }
        }.to change(Role, :count).by(1)
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        post :create, params: { role: valid_attributes }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not create a new Role" do
        expect {
          post :create, params: { role: valid_attributes }
        }.not_to change(Role, :count)
      end
    end
  end
  
  describe "GET #edit" do
    let(:role) { create(:role, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :edit, params: { id: role.id }
        expect(response).to be_successful
      end
      
      it "assigns the requested role" do
        get :edit, params: { id: role.id }
        expect(assigns(:role)).to eq(role)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :edit, params: { id: role.id }
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :edit, params: { id: role.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe "PUT #update" do
    let(:role) { create(:role, tenant: tenant) }
    let(:new_attributes) { { name: { en: 'Updated Role' }, description: { en: 'Updated description' } } }
    
    context "as admin" do
      before { sign_in admin }
      
      context "with valid params" do
        it "updates the requested role" do
          put :update, params: { id: role.id, role: new_attributes }
          role.reload
          expect(role.name['en']).to eq('Updated Role')
          expect(role.description['en']).to eq('Updated description')
        end
        
        it "redirects to the role" do
          put :update, params: { id: role.id, role: new_attributes }
          expect(response).to redirect_to(admin_role_path(role))
        end
      end
      
      context "with invalid params" do
        it "does not update the role" do
          old_name = role.name
          put :update, params: { id: role.id, role: invalid_attributes }
          role.reload
          expect(role.name).to eq(old_name)
        end
        
        it "renders the 'edit' template" do
          put :update, params: { id: role.id, role: invalid_attributes }
          expect(response).to render_template("edit")
        end
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "updates the requested role" do
        put :update, params: { id: role.id, role: new_attributes }
        role.reload
        expect(role.name['en']).to eq('Updated Role')
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        put :update, params: { id: role.id, role: new_attributes }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not update the role" do
        old_name = role.name
        put :update, params: { id: role.id, role: new_attributes }
        role.reload
        expect(role.name).to eq(old_name)
      end
    end
  end
  
  describe "DELETE #destroy" do
    let!(:role) { create(:role, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "destroys the requested role" do
        expect {
          delete :destroy, params: { id: role.id }
        }.to change(Role, :count).by(-1)
      end
      
      it "redirects to the roles list" do
        delete :destroy, params: { id: role.id }
        expect(response).to redirect_to(admin_roles_path)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a forbidden response" do
        delete :destroy, params: { id: role.id }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not destroy the role" do
        expect {
          delete :destroy, params: { id: role.id }
        }.not_to change(Role, :count)
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        delete :destroy, params: { id: role.id }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not destroy the role" do
        expect {
          delete :destroy, params: { id: role.id }
        }.not_to change(Role, :count)
      end
    end
  end
end 