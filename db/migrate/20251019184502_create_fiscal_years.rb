class CreateFiscalYears < ActiveRecord::Migration[8.0]
  def change
    create_table :fiscal_years do |t|
      t.jsonb :name
      t.date :start_date
      t.date :finish_date
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end

    add_index :fiscal_years, :name, using: :gin
    add_index :fiscal_years, :start_date
    add_index :fiscal_years, :finish_date
  end
end
