# frozen_string_literal: true

module MobileOrganizations
  class Component < ViewComponent::Base
    def initialize(
      organizations: [],
      active_org_id: nil,
      can_create: false,
      search_query: nil
    )
      @organizations = organizations
      @active_org_id = active_org_id
      @can_create = can_create
      @search_query = search_query
    end

    private

    attr_reader :organizations, :active_org_id, :can_create, :search_query

    def filtered_organizations
      return organizations unless search_query.present?

      organizations.select do |org|
        org[:name].downcase.include?(search_query.downcase) ||
        org[:description]&.downcase&.include?(search_query.downcase)
      end
    end

    def org_initials(name)
      name.split.map(&:first).join.upcase[0..1]
    end

    def format_member_count(count)
      return "1 member" if count == 1
      "#{count} members"
    end

    def org_status_color(status)
      case status
      when "active" then "bg-green-100 text-green-800"
      when "inactive" then "bg-gray-100 text-gray-800"
      when "pending" then "bg-yellow-100 text-yellow-800"
      else "bg-gray-100 text-gray-800"
      end
    end
  end
end
