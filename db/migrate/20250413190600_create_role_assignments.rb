class CreateRoleAssignments < ActiveRecord::Migration[8.0]
  def change
    create_table :role_assignments do |t|
      t.references :role, null: false, foreign_key: true
      t.references :member, null: false, foreign_key: true
      t.datetime :start_date
      t.datetime :finish_date

      t.timestamps
    end

    add_index :role_assignments, [:role_id, :member_id]
    add_index :role_assignments, [:member_id, :role_id]
  end
end
