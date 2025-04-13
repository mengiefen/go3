class CreateOrganizations < ActiveRecord::Migration[8.0]
  def change
    create_table :organizations do |t|
      t.jsonb :name, null: false
      t.jsonb :description
      t.integer :parent_id
      t.boolean :is_tenant

      t.timestamps
    end
    
    add_index :organizations, :name, using: :gin
    add_index :organizations, :parent_id
  end
end
