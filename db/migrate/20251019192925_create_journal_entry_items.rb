class CreateJournalEntryItems < ActiveRecord::Migration[8.0]
  def change
    create_table :journal_entry_items do |t|
      t.references :journal_entry, null: false, foreign_key: true
      t.integer :row, null: false
      t.references :account, foreign_key: { to_table: :centers }
      t.references :center1, foreign_key: { to_table: :centers }
      t.references :center2, foreign_key: { to_table: :centers }
      t.references :center3, foreign_key: { to_table: :centers }
      t.references :center4, foreign_key: { to_table: :centers }
      t.references :center5, foreign_key: { to_table: :centers }
      t.references :center6, foreign_key: { to_table: :centers }
      t.jsonb :description
      t.float :debit
      t.float :credit
      t.references :currency, null: false, foreign_key: true
      t.float :rate
      t.float :currency_amount

      t.timestamps
    end

    add_index :journal_entry_items, :debit
    add_index :journal_entry_items, :credit
    add_index :journal_entry_items, :currency_amount
    add_index :journal_entry_items, :rate
  end
end
