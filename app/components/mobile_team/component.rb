# frozen_string_literal: true

module MobileTeam
  class Component < ViewComponent::Base
    def initialize(
      team_members: [],
      departments: [],
      current_user: nil
    )
      @team_members = team_members
      @departments = departments
      @current_user = current_user
    end

    private

    attr_reader :team_members, :departments, :current_user

    def member_initials(name)
      name.split.map(&:first).join.upcase[0..1]
    end

    def member_status(member)
      return "active" if member[:is_online]
      return "away" if member[:status] == "away"
      "offline"
    end

    def status_color(status)
      case status
      when "active" then "bg-green-400"
      when "away" then "bg-yellow-400"
      else "bg-gray-400"
      end
    end
  end
end
