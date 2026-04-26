class MemberBlueprint < Blueprinter::Base
  identifier :id

  view :index do
    fields :name, :email, :color, :initial, :org_admin?, :status, :localized_status
  end

  view :show do
    include_view :index
    fields :user_id, :created_at, :updated_at, :invited_at, :joined_at, :archived_at
    field :translations_hash, name: :t
  end
end
