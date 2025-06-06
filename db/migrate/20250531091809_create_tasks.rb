class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, default: 'pending'
      t.string :priority, default: 'medium'
      t.string :category, default: 'general'
      t.datetime :due_date
      t.datetime :completed_at
      t.references :user, null: false, foreign_key: true
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end

    add_index :tasks, [:status, :priority]
    add_index :tasks, :category
    add_index :tasks, :due_date
  end
end
