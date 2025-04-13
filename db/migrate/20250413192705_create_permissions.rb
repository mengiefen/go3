class CreatePermissions < ActiveRecord::Migration[8.0]
  def change
    create_table :permissions do |t|
      t.string :permission_code, null: false
      t.references :grantee, polymorphic: true, null: false
      t.references :target, polymorphic: true, null: true

      t.timestamps
    end

    add_index :permissions, :permission_code
    add_index :permissions, [:grantee_id, :grantee_type, :permission_code], 
              name: 'index_permissions_on_grantee_and_code'
  end
end
