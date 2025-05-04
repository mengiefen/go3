class AddIsTrialToOrganizations < ActiveRecord::Migration[7.1]
  def change
    add_column :organizations, :is_trial, :boolean, default: false
  end
end 