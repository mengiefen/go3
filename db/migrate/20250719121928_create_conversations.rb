class CreateConversations < ActiveRecord::Migration[7.1]
  def change
    create_table :conversations do |t|
      t.boolean :is_group, null: false, default: false
      t.string :name # for group chats only
      t.references :organization, null: false

      t.timestamps
    end
  end
end
