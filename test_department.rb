# test_department.rb
# Run this in a Rails console: load 'test_department.rb'

# Create an organization
org = Organization.create!(name: { 'en' => "Test Organization #{Time.now.to_i}" })

# Create a department with specific name
puts "Creating department with specific name..."
dept1 = Department.new(organization: org)
dept1.name = { 'en' => 'Marketing', 'fr' => 'Marketing (FR)', 'ar' => 'تسويق' }
dept1.save!
puts "Successfully created department with ID: #{dept1.id}"
puts "Name: #{dept1.name.inspect}"

# Create a department using setters
puts "\nCreating department using setters..."
dept2 = Department.new(organization: org)
dept2.name_en = "Sales" 
dept2.name_fr = "Ventes"
dept2.save!
puts "Successfully created department with ID: #{dept2.id}"
puts "Name: #{dept2.name.inspect}"

# Test our changes by trying to set values after initialization
puts "\nTesting setting values after initialization..."
dept3 = Department.new(organization: org)
dept3.name_en = "Engineering"
puts "Successfully set name_en: #{dept3.name_en}"
dept3.save!
puts "Successfully saved department with ID: #{dept3.id}"

puts "\nAll tests passed!" 