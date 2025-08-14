class AddAaaToMember < ActiveRecord::Migration[8.0]
  def change
    add_column :members, :archive_number, :string
    add_column :members, :archived_at, :datetime
  end
end
