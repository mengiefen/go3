class OrganizationBlueprint < Blueprinter::Base
  identifier :id

  view :basic do
    fields :name
  end
end
