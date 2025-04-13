class CreateDepartments < ActiveRecord::Migration[8.0]
  def change
    create_table :departments do |t|
      t.jsonb :name, null: false
      t.jsonb :description
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :departments, :name, using: :gin
  end
end
