module Ui
  class ModalComponentPreview < ViewComponent::Preview
    # @!group Modal Variations
    
    # @label Basic Modal
    # @description A basic modal with a title and content
    def basic
      render_with_template(locals: {
        id: "basic-modal",
        title: "Basic Modal Example",
        size: :md
      })
    end
    
    # @label Different Sizes
    # @description Modals in different size variations
    def sizes
      render_with_template
    end
    
    # @label Full Screen Modal
    # @description A modal that takes up the full screen
    def full_screen
      render_with_template(locals: {
        id: "fullscreen-modal",
        title: "Full Screen Modal",
        full_screen: true
      })
    end
    
    # @label Custom Header and Footer
    # @description Modal with custom header and footer content
    def custom_header_footer
      render_with_template(locals: {
        id: "custom-modal",
        size: :lg
      })
    end
    
    # @label Form in Modal
    # @description Modal containing a form
    def with_form
      render_with_template(locals: {
        id: "form-modal",
        title: "Add New User",
        size: :lg
      })
    end
    
    # @!endgroup
  end
end
