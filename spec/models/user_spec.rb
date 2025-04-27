require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#is_go3_admin?' do
    it 'returns true when role is GO3_ADMIN' do
      user = build(:user, role: 'GO3_ADMIN')
      expect(user.is_go3_admin?).to be true
    end

    it 'returns true when is_admin is true' do
      user = build(:user, is_admin: true, role: nil)
      expect(user.is_go3_admin?).to be true
    end

    it 'returns false when role is not GO3_ADMIN and is_admin is false' do
      user = build(:user, role: 'OTHER_ROLE', is_admin: false)
      expect(user.is_go3_admin?).to be false
    end

    it 'returns false when role is nil and is_admin is false' do
      user = build(:user, role: nil, is_admin: false)
      expect(user.is_go3_admin?).to be false
    end
  end
  
  describe 'role encryption' do
    it 'stores role in encrypted form in the database' do
      user = create(:user, role: 'GO3_ADMIN')
      
      # Query the database directly to get the raw value
      raw_role_value = ActiveRecord::Base.connection.execute(
        "SELECT role FROM users WHERE id = #{user.id}"
      ).first['role']
      
      # The stored value should not be the plaintext 'GO3_ADMIN'
      expect(raw_role_value).not_to eq('GO3_ADMIN')
      
      # But the model should decrypt it correctly
      user_refetched = User.find(user.id)
      expect(user_refetched.role).to eq('GO3_ADMIN')
      expect(user_refetched.is_go3_admin?).to be true
    end
  end
  
  describe 'admin flag sync' do
    it 'sets is_admin to true when role is GO3_ADMIN' do
      user = create(:user, role: 'GO3_ADMIN')
      expect(user.is_admin).to be true
    end
    
    it 'sets is_admin to false when role is not GO3_ADMIN' do
      user = create(:user, role: 'OTHER_ROLE')
      expect(user.is_admin).to be false
    end
    
    it 'sets is_admin to false when role is nil' do
      user = create(:user, role: nil)
      expect(user.is_admin).to be false
    end
  end
end 