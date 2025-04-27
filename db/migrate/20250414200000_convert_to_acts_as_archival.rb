class ConvertToActsAsArchival < ActiveRecord::Migration[7.1]
  def change
    # Remove the old discard column and index
    remove_index :organizations, :discarded_at
    remove_column :organizations, :discarded_at, :datetime

    # Add acts_as_archival columns
    add_column :organizations, :archived_at, :datetime
    add_column :organizations, :archive_number, :integer
    add_index :organizations, :archived_at
  end
end 