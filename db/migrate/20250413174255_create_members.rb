class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.string :email, null: false
      t.jsonb :name
      t.references :organization, null: false, foreign_key: true
      t.references :user, null: true, foreign_key: true
      t.string :status

      t.timestamps
    end
    add_index :members, :email
    add_index :members, :name, using: :gin
  end
end
