class OrganizationLocaleConfig < ActiveRecord::Migration[8.0]
  def up
    rename_column :organizations, :language, :locale
    rename_column :users, :language, :locale
    remove_column :users, :preferred_locale
    add_column :organizations, :active_locales, :string, array: true, default: [], null: false
    add_column :organizations, :inactive_locales, :string, array: true, default: [], null: false
  end

  def down
    rename_column :organizations, :locale, :language
    rename_column :users, :locale, :language
    add_column :users, :preferred_locale, :string, null: false, default: :en
    remove_column :organizations, :active_locales
    remove_column :organizations, :inactive_locales
  end
end
