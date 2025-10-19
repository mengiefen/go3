class AddUseParentOrgCurrenciesToOrganizations < ActiveRecord::Migration[8.0]
  def change
    add_reference :organizations, :main_currency, foreign_key: { to_table: :currencies }
    add_column :organizations, :use_parent_org_currencies, :boolean, default: false
    add_column :organizations, :use_parent_org_accounts, :boolean, default: false
    add_column :organizations, :use_parent_org_centers, :boolean, default: false
    add_column :organizations, :use_parent_org_fiscal_years, :boolean, default: false
    add_column :organizations, :account_category_length, :integer, default: 1
    add_column :organizations, :ledger_length, :integer, default: 2
    add_column :organizations, :account_length, :integer, default: 2
    add_column :organizations, :center_length, :integer, default: 6
    add_column :organizations, :center_levels, :integer, default: 3
  end
end
