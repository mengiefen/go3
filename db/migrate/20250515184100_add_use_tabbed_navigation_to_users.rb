class AddUseTabbedNavigationToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :use_tabbed_navigation, :boolean, default: true
  end
end
