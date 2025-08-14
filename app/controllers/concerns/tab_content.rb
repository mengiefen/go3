module TabContent
  extend ActiveSupport::Concern

  included do
    before_action :handle_tab_content_request, if: -> { request.headers['X-Tab-Content'] }
  end

  def handle_tab_content_request
    # Call the original action to set up instance variables
    send(action_name)
    request.format = :html
    render layout: false
  end
end