class AddInvitationToMembers < ActiveRecord::Migration[8.0]
  def change
    add_column :members, :invited_at, :datetime
    add_column :members, :invitation_key, :string
    add_column :members, :joined_at, :datetime
  end
end
