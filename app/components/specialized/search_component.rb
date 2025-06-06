# frozen_string_literal: true

module Specialized
  class SearchComponent < ViewComponent::Base
    renders_one :trigger
    renders_many :results
    renders_many :categories

    # Alias for categories
    def category(&block)
      categories(&block)
    end
    
    # Alias for results
    def result(&block)
      results(&block)
    end
    
    attr_reader :id, :placeholder, :scope, :shortcut, :display, :position
    
    # @param id [String] Unique identifier for the search component
    # @param placeholder [String] Placeholder text for the search input
    # @param scope [Symbol] :page, :global, or :all - determines search scope
    # @param shortcut [String] Keyboard shortcut to display (e.g., "K")
    # @param display [Symbol] :dropdown or :modal - determines display style
    # @param position [Symbol] :center, :top, or :inline - position of the search panel
    def initialize(id: nil, 
                  placeholder: "Search...", 
                  scope: :page, 
                  shortcut: "K", 
                  display: :modal, 
                  position: :center)
      @id = id || "search-#{SecureRandom.hex(4)}"
      @placeholder = placeholder
      @scope = scope
      @shortcut = shortcut
      @display = display
      @position = position
    end
    
    def shortcut_key
      shortcut.present? ? shortcut.to_s.upcase : nil
    end
    
    def shortcut_display
      return nil unless shortcut_key
      
      if shortcut_key.length == 1
        "Ctrl+#{shortcut_key}"
      else
        shortcut_key
      end
    end
    
    def modal?
      display == :modal
    end
    
    def dropdown?
      display == :dropdown
    end
    
    def position_classes
      base_classes = "bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10"
      
      case position.to_sym
      when :center
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl #{base_classes}"
      when :top
        "fixed left-1/2 top-4 -translate-x-1/2 w-full max-w-xl #{base_classes}"
      when :inline
        "relative w-full #{base_classes}"
      else
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl #{base_classes}"
      end
    end
    
    def backdrop_classes
      if modal?
        "fixed inset-0 bg-gray-500/50 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity z-40"
      else
        "hidden"
      end
    end
  end
end
