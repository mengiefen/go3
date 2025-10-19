class CreateJournalEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :journal_entries do |t|
      t.date :date, null: false
      t.date :effective_date, null: false
      t.references :fiscal_year, null: false, foreign_key: true
      t.references :branch, null: false, foreign_key: true
      t.string :no, null: false
      t.string :ref, null: false
      t.integer :daily_no, null: false
      t.integer :state, null: false
      t.integer :entry_type, null: false
      t.jsonb :description
      t.float :debit
      t.float :credit
      t.references :organization, null: false, foreign_key: true
      t.references :creator, foreign_key: { to_table: :members }

      t.timestamps
    end

    add_index :journal_entries, :no
    add_index :journal_entries, :daily_no
    add_index :journal_entries, :state
    add_index :journal_entries, :entry_type
    add_index :journal_entries, :description, using: :gin
    add_index :journal_entries, :debit
    add_index :journal_entries, :credit
  end
end
