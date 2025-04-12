require 'rails_helper'

RSpec.describe Admin::DepartmentsController, type: :controller do
  let(:tenant) { create(:tenant) }
  
  let(:admin) do
    user = create(:user, tenant: tenant)
    admin_role = create(:role, name: { en: 'Admin' }, tenant: tenant)
    create(:permission, permission_code: 'department.manage', subject: admin_role, tenant: tenant)
    create(:role_assignment, role: admin_role, assignee: user, tenant: tenant)
    user
  end
  
  let(:manager) do
    user = create(:user, tenant: tenant)
    manager_role = create(:role, name: { en: 'Manager' }, tenant: tenant)
    create(:permission, permission_code: 'department.read', subject: manager_role, tenant: tenant)
    create(:permission, permission_code: 'department.create', subject: manager_role, tenant: tenant)
    create(:permission, permission_code: 'department.update', subject: manager_role, tenant: tenant)
    create(:role_assignment, role: manager_role, assignee: user, tenant: tenant)
    user
  end
  
  let(:regular_user) { create(:user, tenant: tenant) }
  
  let(:valid_attributes) do
    {
      name: { en: 'Engineering' },
      description: { en: 'Engineering department' }
    }
  end
  
  let(:invalid_attributes) do
    {
      name: {},
      description: { en: 'Invalid department without name' }
    }
  end
  
  describe "GET #index" do
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :index
        expect(response).to be_successful
      end
      
      it "lists all departments for current tenant" do
        department1 = create(:department, tenant: tenant)
        department2 = create(:department, tenant: tenant)
        other_tenant_department = create(:department)
        
        get :index
        
        expect(assigns(:departments)).to include(department1, department2)
        expect(assigns(:departments)).not_to include(other_tenant_department)
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
    let(:department) { create(:department, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :show, params: { id: department.id }
        expect(response).to be_successful
      end
      
      it "assigns the requested department" do
        get :show, params: { id: department.id }
        expect(assigns(:department)).to eq(department)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :show, params: { id: department.id }
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :show, params: { id: department.id }
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
      
      it "assigns a new department" do
        get :new
        expect(assigns(:department)).to be_a_new(Department)
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
        it "creates a new Department" do
          expect {
            post :create, params: { department: valid_attributes }
          }.to change(Department, :count).by(1)
        end
        
        it "sets the tenant to the current user's tenant" do
          post :create, params: { department: valid_attributes }
          expect(Department.last.tenant).to eq(admin.tenant)
        end
        
        it "redirects to the created department" do
          post :create, params: { department: valid_attributes }
          expect(response).to redirect_to(admin_department_path(Department.last))
        end
      end
      
      context "with invalid params" do
        it "does not create a new Department" do
          expect {
            post :create, params: { department: invalid_attributes }
          }.not_to change(Department, :count)
        end
        
        it "renders the 'new' template" do
          post :create, params: { department: invalid_attributes }
          expect(response).to render_template("new")
        end
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "creates a new Department" do
        expect {
          post :create, params: { department: valid_attributes }
        }.to change(Department, :count).by(1)
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        post :create, params: { department: valid_attributes }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not create a new Department" do
        expect {
          post :create, params: { department: valid_attributes }
        }.not_to change(Department, :count)
      end
    end
  end
  
  describe "GET #edit" do
    let(:department) { create(:department, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "returns a success response" do
        get :edit, params: { id: department.id }
        expect(response).to be_successful
      end
      
      it "assigns the requested department" do
        get :edit, params: { id: department.id }
        expect(assigns(:department)).to eq(department)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a success response" do
        get :edit, params: { id: department.id }
        expect(response).to be_successful
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        get :edit, params: { id: department.id }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe "PUT #update" do
    let(:department) { create(:department, tenant: tenant) }
    let(:new_attributes) { { name: { en: 'Updated Department' }, description: { en: 'Updated description' } } }
    
    context "as admin" do
      before { sign_in admin }
      
      context "with valid params" do
        it "updates the requested department" do
          put :update, params: { id: department.id, department: new_attributes }
          department.reload
          expect(department.name['en']).to eq('Updated Department')
          expect(department.description['en']).to eq('Updated description')
        end
        
        it "redirects to the department" do
          put :update, params: { id: department.id, department: new_attributes }
          expect(response).to redirect_to(admin_department_path(department))
        end
      end
      
      context "with invalid params" do
        it "does not update the department" do
          old_name = department.name
          put :update, params: { id: department.id, department: invalid_attributes }
          department.reload
          expect(department.name).to eq(old_name)
        end
        
        it "renders the 'edit' template" do
          put :update, params: { id: department.id, department: invalid_attributes }
          expect(response).to render_template("edit")
        end
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "updates the requested department" do
        put :update, params: { id: department.id, department: new_attributes }
        department.reload
        expect(department.name['en']).to eq('Updated Department')
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        put :update, params: { id: department.id, department: new_attributes }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not update the department" do
        old_name = department.name
        put :update, params: { id: department.id, department: new_attributes }
        department.reload
        expect(department.name).to eq(old_name)
      end
    end
  end
  
  describe "DELETE #destroy" do
    let!(:department) { create(:department, tenant: tenant) }
    
    context "as admin" do
      before { sign_in admin }
      
      it "destroys the requested department" do
        expect {
          delete :destroy, params: { id: department.id }
        }.to change(Department, :count).by(-1)
      end
      
      it "redirects to the departments list" do
        delete :destroy, params: { id: department.id }
        expect(response).to redirect_to(admin_departments_path)
      end
    end
    
    context "as manager" do
      before { sign_in manager }
      
      it "returns a forbidden response" do
        delete :destroy, params: { id: department.id }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not destroy the department" do
        expect {
          delete :destroy, params: { id: department.id }
        }.not_to change(Department, :count)
      end
    end
    
    context "as regular user" do
      before { sign_in regular_user }
      
      it "returns a forbidden response" do
        delete :destroy, params: { id: department.id }
        expect(response).to have_http_status(:forbidden)
      end
      
      it "does not destroy the department" do
        expect {
          delete :destroy, params: { id: department.id }
        }.not_to change(Department, :count)
      end
    end
  end
end 