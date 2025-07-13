# frozen_string_literal: true

class Navigation::TabSystemComponentPreview < ViewComponent::Preview
  # @param theme [Symbol] select { choices: [vscode, chrome, minimal, enterprise] }
  # @param show_icons [Boolean]
  # @param show_close_buttons [Boolean]
  # @param allow_reorder [Boolean]
  # @param show_actions_menu [Boolean]
  def playground(
    theme: :enterprise,
    show_icons: false,
    show_close_buttons: true,
    allow_reorder: true,
    show_actions_menu: true
  )
    render_with_template(locals: {
      theme: theme,
      show_icons: show_icons,
      show_close_buttons: show_close_buttons,
      allow_reorder: allow_reorder,
      show_actions_menu: show_actions_menu
    })
  end

  # Enterprise theme (recommended)
  def enterprise_theme
    render TabSystem::Component.new(
      theme: :enterprise,
      show_icons: false,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system"
    )
  end

  # VSCode theme (classic)
  def vscode_theme
    render TabSystem::Component.new(
      theme: :vscode,
      show_icons: true,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system"
    )
  end

  # Chrome theme (rounded)
  def chrome_theme
    render TabSystem::Component.new(
      theme: :chrome,
      show_icons: true,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system"
    )
  end

  # Minimal theme (clean)
  def minimal_theme
    render TabSystem::Component.new(
      theme: :minimal,
      show_icons: false,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system"
    )
  end

  # With icons enabled
  def with_icons
    render TabSystem::Component.new(
      theme: :enterprise,
      show_icons: true,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system"
    )
  end

  # Without close buttons
  def without_close_buttons
    render TabSystem::Component.new(
      theme: :enterprise,
      show_icons: false,
      show_close_buttons: false,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system"
    )
  end

  # Without actions menu
  def without_actions_menu
    render TabSystem::Component.new(
      theme: :enterprise,
      show_icons: false,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: false,
      controller_name: "tab-system"
    )
  end

  # Compact version (minimal features)
  def compact
    render TabSystem::Component.new(
      theme: :enterprise,
      show_icons: false,
      show_close_buttons: false,
      allow_reorder: false,
      show_actions_menu: false,
      controller_name: "tab-system"
    )
  end
end
