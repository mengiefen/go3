require 'shoulda/matchers'

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

module Shoulda
  module Matchers
    module ActiveRecord
      # Add using method to HaveDbIndexMatcher
      class HaveDbIndexMatcher
        def using(type)
          self
        end
      end

      # Add as method to AssociationMatcher
      class AssociationMatcher
        def as(type)
          self
        end
      end
    end
  end
end 