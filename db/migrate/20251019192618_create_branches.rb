class CreateBranches < ActiveRecord::Migration[8.0]
  def change
    create_table :branches do |t|
      t.jsonb :name
      t.string :code
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end

    add_index :branches, :name, using: :gin
    add_index :branches, :code
  end
end
