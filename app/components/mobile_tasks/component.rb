# frozen_string_literal: true

module MobileTasks
  class Component < ViewComponent::Base
    def initialize(
      tasks: [],
      filter: 'all',
      sort_by: 'due_date',
      current_user: nil
    )
      @tasks = tasks
      @filter = filter
      @sort_by = sort_by
      @current_user = current_user
    end

    private

    attr_reader :tasks, :filter, :sort_by, :current_user

    def filtered_tasks
      case filter
      when 'today'
        tasks.select { |t| t[:due_date]&.to_date == Date.today }
      when 'overdue'
        tasks.select { |t| t[:due_date] && t[:due_date] < Date.today && t[:status] != 'completed' }
      when 'assigned'
        tasks.select { |t| t[:assignee_id] == current_user&.id }
      when 'completed'
        tasks.select { |t| t[:status] == 'completed' }
      else
        tasks
      end
    end

    def sorted_tasks
      filtered_tasks.sort_by do |task|
        case sort_by
        when 'due_date'
          task[:due_date] || Date.new(9999)
        when 'priority'
          priority_value(task[:priority])
        when 'created'
          task[:created_at] || Time.now
        else
          task[:title]
        end
      end
    end

    def priority_value(priority)
      case priority
      when 'urgent' then 0
      when 'high' then 1
      when 'medium' then 2
      when 'low' then 3
      else 4
      end
    end

    def priority_color(priority)
      case priority
      when 'urgent' then 'text-red-600 bg-red-100'
      when 'high' then 'text-orange-600 bg-orange-100'
      when 'medium' then 'text-yellow-600 bg-yellow-100'
      when 'low' then 'text-green-600 bg-green-100'
      else 'text-gray-600 bg-gray-100'
      end
    end

    def status_icon(status)
      case status
      when 'completed'
        '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
      when 'in_progress'
        '<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
      else
        '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"></circle></svg>'
      end
    end

    def format_due_date(date)
      return nil unless date
      
      today = Date.today
      date = date.to_date
      
      if date == today
        "Today"
      elsif date == today + 1
        "Tomorrow"
      elsif date == today - 1
        "Yesterday"
      elsif date < today
        "#{(today - date).to_i} days overdue"
      elsif date < today + 7
        date.strftime("%A")
      else
        date.strftime("%b %d")
      end
    end
  end
end