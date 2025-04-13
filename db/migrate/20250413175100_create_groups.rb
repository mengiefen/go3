class CreateGroups < ActiveRecord::Migration[8.0]
  def change
    create_table :groups do |t|
      t.jsonb :name, null: false
      t.jsonb :description
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :groups, :name, using: :gin
  end
end
