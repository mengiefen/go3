class CreateAccountCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :account_categories do |t|
      t.string :code, null: false
      t.jsonb :name
      t.integer :type, null: false
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end

    add_index :account_categories, :name, using: :gin
    add_index :account_categories, :code
  end
end
