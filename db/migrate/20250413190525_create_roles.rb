class CreateRoles < ActiveRecord::Migration[8.0]
  def change
    create_table :roles do |t|
      t.jsonb :name, null: false
      t.jsonb :description
      t.integer :parent_id
      t.references :organization, null: false, foreign_key: true
      t.references :department, null: true, foreign_key: true
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :roles, :name, using: :gin
    add_index :roles, :parent_id
  end
end
