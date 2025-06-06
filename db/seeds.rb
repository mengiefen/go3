# Create sample data for development and testing

# Ensure we have a test organization
org = Organization.where("name->>'en' = ?", "Demo Organization").first
unless org
  org = Organization.new
  org.write_attribute(:name, { "en" => "Demo Organization" })
  org.write_attribute(:description, { "en" => "A sample organization for testing" })
  org.save!
end

# Ensure we have a test user
user = User.find_or_create_by!(email: "demo@example.com") do |u|
  u.password = "SecureP@ssw0rd123!"
  u.password_confirmation = "SecureP@ssw0rd123!"
  u.first_name = "Demo"
  u.last_name = "User"
  u.confirmed_at = Time.current
end

# Create membership if it doesn't exist
member = Member.find_by(user: user, organization: org)
unless member
  member = Member.new(user: user, organization: org, email: user.email)
  member.write_attribute(:name, { "en" => user.full_name })
  member.save!
end

# Create sample tasks
puts "Creating sample tasks..."

task_titles = [
  "Setup development environment",
  "Design user interface mockups",
  "Implement user authentication",
  "Write API documentation", 
  "Create database migration scripts",
  "Setup automated testing pipeline",
  "Optimize application performance",
  "Implement search functionality",
  "Design responsive mobile layout",
  "Setup deployment infrastructure",
  "Create user onboarding flow",
  "Implement email notifications",
  "Setup monitoring and logging",
  "Create admin dashboard",
  "Implement file upload feature",
  "Design error handling system",
  "Setup backup procedures",
  "Create API rate limiting",
  "Implement caching strategy",
  "Design security audit checklist",
  "Create user feedback system",
  "Implement social media integration",
  "Setup internationalization",
  "Create payment processing",
  "Implement two-factor authentication",
  "Design landing page",
  "Setup analytics tracking",
  "Create newsletter system",
  "Implement chat functionality",
  "Design help documentation",
  "Create workflow automation",
  "Implement data export feature",
  "Setup CDN configuration",
  "Create mobile app wireframes",
  "Implement push notifications",
  "Design accessibility features",
  "Setup load balancing",
  "Create integration tests",
  "Implement dark mode theme",
  "Design onboarding tutorial",
  "Create API versioning strategy",
  "Implement advanced search filters",
  "Setup error tracking service",
  "Create data visualization charts",
  "Implement bulk operations",
  "Design notification preferences",
  "Setup staging environment",
  "Create user role management",
  "Implement audit trail logging",
  "Design report generation system"
]

descriptions = [
  "This task involves setting up the complete development environment including all necessary tools and dependencies.",
  "Create comprehensive UI/UX mockups that will serve as the foundation for the application design.",
  "Implement secure user authentication system with password reset and email verification.",
  "Document all API endpoints with clear examples and response formats for developers.",
  "Create and test database migration scripts to ensure smooth schema updates.",
  "Setup continuous integration pipeline for automated testing and deployment.",
  "Analyze and optimize application performance bottlenecks for better user experience.",
  "Implement powerful search functionality with filtering and sorting capabilities.",
  "Design and develop responsive layouts that work seamlessly across all mobile devices.",
  "Setup robust deployment infrastructure with proper monitoring and scaling capabilities.",
  "Create intuitive user onboarding experience to help new users get started quickly.",
  "Implement comprehensive email notification system for important user events.",
  "Setup application monitoring, logging, and alerting for production readiness.",
  "Create powerful admin dashboard for managing users, content, and system settings.",
  "Implement secure file upload feature with proper validation and storage management.",
  "Design comprehensive error handling system with user-friendly error messages.",
  "Setup automated backup procedures to ensure data safety and disaster recovery.",
  "Implement API rate limiting to prevent abuse and ensure fair usage.",
  "Design and implement caching strategy to improve application performance.",
  "Create security audit checklist and implement security best practices.",
  "Implement user feedback system to collect and analyze user suggestions.",
  "Setup social media integration for user login and content sharing.",
  "Implement internationalization support for multiple languages and locales.",
  "Integrate secure payment processing system with multiple payment methods.",
  "Implement two-factor authentication for enhanced account security.",
  "Design compelling landing page to showcase product features and benefits.",
  "Setup comprehensive analytics tracking to understand user behavior patterns.",
  "Create newsletter system for user engagement and product updates.",
  "Implement real-time chat functionality for user communication.",
  "Create comprehensive help documentation and user guides."
]

# Create 50 sample tasks with varied data
50.times do |i|
  title = task_titles[i] || "Sample Task #{i + 1}"
  description = descriptions[i % descriptions.length]
  
  # Create realistic due dates - some past, some future, some nil
  due_date = case i % 4
  when 0
    nil  # No due date
  when 1
    rand(1..30).days.from_now  # Future due date
  when 2
    rand(1..15).days.ago  # Past due date (overdue)
  when 3
    rand(1..7).days.from_now  # Near future
  end
  
  # Create varied completion dates for completed tasks
  completed_at = nil
  status = Task::STATUSES.sample
  
  if status == 'completed'
    completed_at = rand(1..30).days.ago
  end
  
  Task.find_or_create_by!(
    title: title,
    user: user,
    organization: org
  ) do |task|
    task.description = description
    task.status = status
    task.priority = Task::PRIORITIES.sample
    task.category = Task::CATEGORIES.sample
    task.due_date = due_date
    task.completed_at = completed_at
  end
end

puts "Created #{Task.count} tasks for demonstration"

# Create additional test users and tasks
5.times do |i|
  test_user = User.find_or_create_by!(email: "user#{i + 1}@example.com") do |u|
    u.password = "SecureP@ssw0rd#{i + 100}!"
    u.password_confirmation = "SecureP@ssw0rd#{i + 100}!"
    u.first_name = "Test"
    u.last_name = "Smith"
    u.confirmed_at = Time.current
  end
  
  test_member = Member.find_by(user: test_user, organization: org)
  unless test_member
    test_member = Member.new(user: test_user, organization: org, email: test_user.email)
    test_member.write_attribute(:name, { "en" => test_user.full_name })
    test_member.save!
  end
  
  # Create 10 tasks for each test user
  10.times do |j|
    Task.find_or_create_by!(
      title: "Task #{j + 1} for #{test_user.first_name}",
      user: test_user,
      organization: org
    ) do |task|
      task.description = "This is a sample task assigned to #{test_user.full_name}"
      task.status = Task::STATUSES.sample
      task.priority = Task::PRIORITIES.sample
      task.category = Task::CATEGORIES.sample
      task.due_date = rand(1..30).days.from_now if rand(2) == 1
    end
  end
end

puts "Total tasks created: #{Task.count}"
puts "Demo organization: #{org.name}"
puts "Demo user: #{user.email}"
