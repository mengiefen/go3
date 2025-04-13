class CreateRoleAssignments < ActiveRecord::Migration[8.0]
  def change
    create_table :role_assignments do |t|
      t.references :role, null: false, foreign_key: true
      t.references :assignee, polymorphic: true, null: false
      t.references :organization, null: false, foreign_key: true
      t.datetime :start_date
      t.datetime :finish_date

      t.timestamps
    end

    add_index :role_assignments, [:assignee_id, :assignee_type]
    add_index :role_assignments, [:role_id, :assignee_id, :assignee_type], unique: true, name: 'index_role_assignments_on_role_and_assignee'
  end
end
