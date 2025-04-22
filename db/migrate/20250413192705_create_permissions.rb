class CreatePermissions < ActiveRecord::Migration[8.0]
  def change
    create_table :permissions do |t|
      t.string :code, null: false
      t.string :grantee_type, null: false
      t.bigint :grantee_id, null: false
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end

    add_index :permissions, [:code, :grantee_type, :grantee_id], unique: true, name: 'index_permissions_on_code_and_grantee'
    add_index :permissions, [:grantee_type, :grantee_id], name: 'index_permissions_on_grantee_type_and_grantee_id'
    add_index :permissions, :code, name: 'index_permissions_on_code'
    add_index :permissions, :grantee_id, name: 'index_permissions_on_grantee_id'
    add_index :permissions, :grantee_type, name: 'index_permissions_on_grantee_type'
  end
end
