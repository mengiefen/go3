class Task < ApplicationRecord
  belongs_to :user
  belongs_to :organization

  STATUSES = %w[pending in_progress completed cancelled].freeze
  PRIORITIES = %w[low medium high urgent].freeze
  CATEGORIES = %w[general development design marketing sales support admin].freeze

  validates :title, presence: true, length: { maximum: 255 }
  validates :status, inclusion: { in: STATUSES }
  validates :priority, inclusion: { in: PRIORITIES }
  validates :category, inclusion: { in: CATEGORIES }

  scope :by_status, ->(status) { where(status: status) }
  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :by_category, ->(category) { where(category: category) }
  scope :due_soon, -> { where(due_date: ..1.week.from_now) }
  scope :overdue, -> { where(due_date: ...Time.current).where(status: %w[pending in_progress]) }

  def completed?
    status == 'completed'
  end

  def overdue?
    due_date.present? && due_date < Time.current && !completed?
  end

  def complete!
    update!(status: 'completed', completed_at: Time.current)
  end

  def priority_color
    case priority
    when 'low' then 'green'
    when 'medium' then 'yellow'
    when 'high' then 'orange'
    when 'urgent' then 'red'
    else 'gray'
    end
  end

  def status_color
    case status
    when 'pending' then 'gray'
    when 'in_progress' then 'blue'
    when 'completed' then 'green'
    when 'cancelled' then 'red'
    else 'gray'
    end
  end
end
