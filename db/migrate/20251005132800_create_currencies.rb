class CreateCurrencies < ActiveRecord::Migration[8.0]
  def change
    create_table :currencies do |t|
      t.jsonb :name
      t.string :abr
      t.integer :decimal_digits
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end

    add_index :currencies, :name, using: :gin
    add_index :currencies, :abr
  end
end
