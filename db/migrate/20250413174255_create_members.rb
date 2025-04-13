class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.string :email, null: false
      t.string :name
      t.references :organization, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
    add_index :members, :email
  end
end
