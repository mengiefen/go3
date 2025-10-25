class DemoController < ApplicationController
  skip_before_action :authenticate_user!
  layout "demo"

  def index
    @page_title = "Demo Home"
    @tab_key = :page1
  end

  def page2
    @page_title = "Demo Page 2"
    @tab_key = :page2
    sleep 3
  end

  def page3
    @page_title = "Demo Page 3"
    @tab_key = :page3
    sleep 5
  end

  private

  def set_tab_title(title)
    response.set_header("Tab-Title", title)
  end
end
