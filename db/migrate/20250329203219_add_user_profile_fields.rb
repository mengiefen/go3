class AddUserProfileFields < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :address, :text
    add_column :users, :language, :string, default: "en"
    
    # Add index for language for faster queries
    add_index :users, :language
  end
end
