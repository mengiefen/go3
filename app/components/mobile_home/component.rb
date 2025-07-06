# frozen_string_literal: true

module MobileHome
  class Component < ViewComponent::Base
    def initialize(
      user_name: "User",
      org_count: 0,
      task_count: 0,
      recent_orgs: [],
      today_tasks: [],
      classes: ""
    )
      @user_name = user_name
      @org_count = org_count
      @task_count = task_count
      @recent_orgs = recent_orgs
      @today_tasks = today_tasks
      @classes = classes
    end

    private

    attr_reader :user_name, :org_count, :task_count, :recent_orgs, :today_tasks, :classes

    def greeting
      hour = Time.current.hour
      if hour < 12
        "Good morning"
      elsif hour < 17
        "Good afternoon"
      else
        "Good evening"
      end
    end

    def formatted_date
      Time.current.strftime("%A, %B %d")
    end
  end
end