namespace :letter_opener do
  desc 'Clear the letter_opener_web folder'
  task :clear => :environment do
    require 'fileutils'
    FileUtils.rm_rf(Rails.root.join('tmp', 'letter_opener_web'))
    puts "Cleared letter_opener_web folder"
  end
end 
