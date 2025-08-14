class ReusableTabsDemoController < ApplicationController
  def index
    # Demo page for showcasing reusable tab components
  end

  def full_implementation
    # Full implementation with all features
  end

  def test
    # Test page for debugging controllers
  end

  def sidebar_content
    @sidebar_type = params[:sidebar_type]

    Rails.logger.info "=== SIDEBAR REQUEST ==="
    Rails.logger.info "Sidebar type: #{@sidebar_type}"
    Rails.logger.info "All params: #{params.inspect}"

    respond_to do |format|
      format.turbo_stream do
        Rails.logger.info "Rendering NavigationSidebar with navigation_type: #{@sidebar_type}"

        # Try rendering just the NavigationSidebar component directly
        sidebar_html = render_to_string(
          NavigationSidebar::Component.new(
            navigation_type: @sidebar_type,
            collapsible: true,
            search_enabled: false,
            controller_name: "reusable-navigation-sidebar"
          )
        )

        Rails.logger.info "Generated sidebar HTML length: #{sidebar_html.length}"
        Rails.logger.info "=== END SIDEBAR REQUEST ==="

        render turbo_stream: turbo_stream.update("secondary-sidebar", sidebar_html)
      end
      format.html do
        render partial: "reusable_tabs_demo/sidebars/#{@sidebar_type}",
               locals: { sidebar_type: @sidebar_type }
      end
    end
  end

  def tab_content
    @content_type = params[:content_type]
    @content_id = params[:content_id]
    @content_name = params[:content_name]
    @frame_id = params[:frame_id]

    Rails.logger.info "Loading tab content: #{@content_type}/#{@content_id}"

    respond_to do |format|
      format.html do
        if @frame_id
          render "reusable_tabs_demo/tab_contents/#{@content_type}",
                 locals: {
                   content_type: @content_type,
                   content_id: @content_id,
                   content_name: @content_name,
                   frame_id: @frame_id
                 },
                 layout: false
        else
          render partial: "reusable_tabs_demo/tab_contents/#{@content_type}",
                 locals: {
                   content_type: @content_type,
                   content_id: @content_id,
                   content_name: @content_name
                 }
        end
      end
    end
  end
end
