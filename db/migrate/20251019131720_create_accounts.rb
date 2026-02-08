class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.references :ledger, null: false, foreign_key: true
      t.string :code, null: false
      t.jsonb :name
      t.references :contra_for, foreign_key: { to_table: :accounts }, null: true
      t.boolean :accepts_other_currencies, null: false
      t.integer :allowed_center_types_1, array: true
      t.integer :allowed_center_types_2, array: true
      t.integer :allowed_center_types_3, array: true
      t.integer :allowed_center_types_4, array: true
      t.integer :allowed_center_types_5, array: true
      t.integer :allowed_center_types_6, array: true

      t.timestamps
    end

    add_index :accounts, :code, unique: true
  end
end
