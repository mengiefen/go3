namespace :test do
  desc "Test Group versioning with PaperTrail"
  task :group_versioning => :environment do
    begin
      # Create a group
      group = Group.create(name: { en: "Test Group" }, description: { en: "Test Description" }, organization: Organization.first || Organization.create(name: { en: "Test Org" }))
      puts "Created group: #{group.name.inspect}"
      puts "Initial version count: #{group.versions.count}"
      
      # Update the group
      group.update(name: { en: "Updated Group Name" })
      puts "Updated group name to: #{group.name.inspect}"
      puts "Version count after update: #{group.versions.count}"
      
      if group.versions.any?
        puts "Last version event: #{group.versions.last.event}"
        puts "Changeset contains name: #{group.versions.last.changeset.key?('name')}"
      else
        puts "❌ No versions recorded"
      end
      
      # Update the group again
      group.update(name: { en: "Changed Again" })
      puts "\nUpdated group name to: #{group.name.inspect}"
      puts "Version count after second update: #{group.versions.count}"
      
      # Make sure the be_versioned custom matcher works
      puts "\nThe Group model passes the be_versioned test: #{Group.included_modules.include?(PaperTrail::Model::InstanceMethods)}"
    rescue => e
      puts "Error: #{e.message}"
      puts e.backtrace.join("\n")
    end
  end
end 