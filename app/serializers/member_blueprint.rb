class MemberBlueprint < Blueprinter::Base
  identifier :id

  view :index do
    fields :name, :email, :color, :initial, :status, :localized_status, :joined_at, :invited_at
    field :org_admin?, name: :org_admin
  end

  view :show do
    include_view :index
    fields :user_id, :created_at, :updated_at, :invited_at, :joined_at, :archived_at
    field :translations_hash, name: :t
  end
end
