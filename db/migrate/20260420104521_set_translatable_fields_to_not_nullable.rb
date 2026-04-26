class SetTranslatableFieldsToNotNullable < ActiveRecord::Migration[8.0]
  def up
    change_column :organizations, :name, :jsonb, null: false, default: {}

    execute <<-SQL
      UPDATE organizations SET description = '{}' WHERE description IS NULL;
      UPDATE organizations SET name = '{}' WHERE name IS NULL;
    SQL
    change_column :organizations, :description, :jsonb, null: false, default: {}
    change_column :members, :name, :jsonb, null: false, default: {}
  end
end
