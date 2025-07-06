# frozen_string_literal: true

module MobileActionSheet
  class Component < ViewComponent::Base
    renders_many :actions
    
    def initialize(
      title: nil,
      cancel_text: "Cancel",
      destructive_action: nil
    )
      @title = title
      @cancel_text = cancel_text
      @destructive_action = destructive_action
    end

    private

    attr_reader :title, :cancel_text, :destructive_action
  end
end