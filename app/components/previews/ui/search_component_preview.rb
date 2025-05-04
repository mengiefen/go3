# frozen_string_literal: true

module Ui
  class SearchComponentPreview < ViewComponent::Preview
    # @!group Display Types

    # @label Modal (Default)
    def modal
      render(Specialized::SearchComponent.new(
        placeholder: "Search anything...",
        display: :modal,
        position: :center
      ))
    end

    # @label Dropdown
    def dropdown
      render(Specialized::SearchComponent.new(
        placeholder: "Search...",
        display: :dropdown,
        position: :inline
      ))
    end

    # @!endgroup

    # @!group Positions

    # @label Center Position
    def center_position
      render(Specialized::SearchComponent.new(
        placeholder: "Search in center position...",
        position: :center
      ))
    end

    # @label Top Position
    def top_position
      render(Specialized::SearchComponent.new(
        placeholder: "Search in top position...",
        position: :top
      ))
    end

    # @label Inline Position
    def inline_position
      render(Specialized::SearchComponent.new(
        placeholder: "Search inline...",
        position: :inline,
        display: :dropdown
      ))
    end

    # @!endgroup

    # @!group Shortcut Options

    # @label With Keyboard Shortcut (Ctrl+K)
    def with_shortcut
      render(Specialized::SearchComponent.new(
        placeholder: "Press Ctrl+K to open...",
        shortcut: "K"
      ))
    end

    # @label With Custom Shortcut (Ctrl+S)
    def with_custom_shortcut
      render(Specialized::SearchComponent.new(
        placeholder: "Press Ctrl+S to open...",
        shortcut: "S"
      ))
    end

    # @label Without Shortcut
    def without_shortcut
      render(Specialized::SearchComponent.new(
        placeholder: "No keyboard shortcut",
        shortcut: nil
      ))
    end

    # @!endgroup

    # @!group Search Scope Options

    # @label Page-level Search
    def page_search
      render(Specialized::SearchComponent.new(
        placeholder: "Search this page...",
        scope: :page
      ))
    end

    # @label Global Search
    def global_search
      render(Specialized::SearchComponent.new(
        placeholder: "Search entire application...",
        scope: :global
      ))
    end

    # @label Switchable Search (Page/Global)
    def switchable_search
      render(Specialized::SearchComponent.new(
        placeholder: "Search (switchable)...",
        scope: :all
      ))
    end

    # @!endgroup
    
    # @!group With Content
    
    # @label With Custom Trigger
    def with_custom_trigger
      render_with_template
    end
    
    # @label With Search Results
    def with_search_results
      render_with_template
    end
    
    # @label With Categories
    def with_categories
      render_with_template
    end
    
    # @!endgroup
  end
end
