class CreateConversationParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :conversation_participants do |t|
      t.references :conversation, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :joined_at, null: false
      t.boolean :include_past_messages, default: false
      t.datetime :left_at

      t.timestamps
    end

    add_index :conversation_participants, [ :conversation_id, :user_id ], unique: true
  end
end
