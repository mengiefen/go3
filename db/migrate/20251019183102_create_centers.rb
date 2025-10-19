class CreateCenters < ActiveRecord::Migration[8.0]
  def change
    create_table :centers do |t|
      t.references :center_type, null: false, foreign_key: true
      t.string :code, null: false
      t.jsonb :name
      t.string :centerable_type
      t.integer :centerable_id

      t.timestamps
    end

    add_index :centers, :name, using: :gin
    add_index :centers, :code
  end
end
