class CreateCenterTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :center_types do |t|
      t.references :organization, null: false, foreign_key: true
      t.jsonb :name
      t.string :first_code, null: false
      t.string :last_code, null: false
      t.boolean :auto_increment, null: false, default: true
      t.string :scope, null: true

      t.timestamps
    end
  end
end
