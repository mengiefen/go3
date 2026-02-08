class CreateLedgers < ActiveRecord::Migration[8.0]
  def change
    create_table :ledgers do |t|
      t.references :account_category, null: false, foreign_key: true
      t.string :code, null: false
      t.jsonb :name
      t.integer :balance_type, null: false
      t.references :contra_for, foreign_key: { to_table: :ledgers }, null: true
      t.integer :unexpected_balance, null: false
      t.boolean :is_monetary

      t.timestamps
    end

    add_index :ledgers, :code, unique: true
  end
end
