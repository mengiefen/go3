class RemoveStatusFromMembers < ActiveRecord::Migration[8.0]
  def change
    remove_column :members, :status
  end
end
