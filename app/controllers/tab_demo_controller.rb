class TabDemoController < ApplicationController
  def index
    # Main tab-demo page with both sidebars and content area
  end
  
  def sidebar_content
    # Returns the secondary sidebar content based on selected icon
    @sidebar_type = params[:sidebar_type]
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update("secondary-sidebar", 
          render_to_string(SecondarySidebarComponent.new(sidebar_type: @sidebar_type))
        )
      end
    end
  end
  
  def tab_content
    # Returns content for a specific tab
    @content_type = params[:content_type]
    @content_id = params[:content_id]
    @content_name = params[:content_name]
    @frame_id = params[:frame_id]
    
    # Force HTML format for turbo-frame requests
    render 'tab_content', locals: {
      content_type: @content_type,
      content_id: @content_id,
      content_name: @content_name,
      frame_id: @frame_id
    }, formats: [:html]
  end
end