class AddLanguageToOrganizations < ActiveRecord::Migration[8.0]
  def change
    add_column :organizations, :language, :string, default: "en", null: false
  end
end
