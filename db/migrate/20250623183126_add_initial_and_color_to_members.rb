class AddInitialAndColorToMembers < ActiveRecord::Migration[8.0]
  def change
    add_column :members, :initial, :string
    add_column :members, :color, :string
  end
end
