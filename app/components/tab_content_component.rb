class TabContentComponent < ViewComponent::Base
  def initialize(content_type:, content_id:, content_name: nil)
    @content_type = content_type
    @content_id = content_id
    @content_name = content_name || generate_content_name
    @tab_id = "tab-#{content_type}-#{content_id}"
  end

  private

  attr_reader :content_type, :content_id, :content_name, :tab_id

  def generate_content_name
    case content_type
    when 'organization'
      "Organization #{content_id}"
    when 'user'
      "User #{content_id}"
    when 'campaign'
      "Campaign #{content_id}"
    when 'report'
      "Report #{content_id}"
    when 'dashboard'
      "Dashboard #{content_id}"
    when 'settings'
      "Settings #{content_id}"
    else
      "Content #{content_id}"
    end
  end

  def content_html
    case content_type
    when 'organization'
      organization_content
    when 'user'
      user_content
    when 'campaign'
      campaign_content
    when 'report'
      report_content
    when 'dashboard'
      dashboard_content
    when 'settings'
      settings_content
    else
      default_content
    end
  end

  def organization_content
    content_tag :div, class: "p-8 h-full overflow-auto" do
      content_tag(:div, class: "max-w-6xl mx-auto") do
        # Header section
        content_tag(:div, class: "flex items-center justify-between mb-8") do
          content_tag(:div, class: "flex items-center") do
            content_tag(:div, class: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4") do
              content_tag(:svg, class: "w-6 h-6 text-white", fill: "currentColor", viewBox: "0 0 20 20") do
                content_tag(:path, "", "fill-rule": "evenodd", d: "M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z", "clip-rule": "evenodd")
              end
            end +
            content_tag(:div) do
              content_tag(:h1, content_name, class: "text-3xl font-bold text-slate-900") +
              content_tag(:p, "Organization Management", class: "text-slate-600 mt-1")
            end
          end +
          content_tag(:div, class: "flex space-x-3") do
            content_tag(:button, class: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium") do
              "Edit Organization"
            end +
            content_tag(:button, class: "px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium") do
              "View Settings"
            end
          end
        end +
        
        # Content grid
        content_tag(:div, class: "grid grid-cols-1 lg:grid-cols-3 gap-6") do
          # Main info card
          content_tag(:div, class: "lg:col-span-2") do
            content_tag(:div, class: "bg-white rounded-xl shadow-sm border border-slate-200 p-6") do
              content_tag(:h2, "Organization Details", class: "text-xl font-semibold text-slate-900 mb-4") +
              content_tag(:div, class: "space-y-4") do
                content_tag(:div, class: "flex justify-between py-3 border-b border-slate-100") do
                  content_tag(:span, "Organization ID", class: "font-medium text-slate-600") +
                  content_tag(:span, content_id, class: "text-slate-900 font-mono")
                end +
                content_tag(:div, class: "flex justify-between py-3 border-b border-slate-100") do
                  content_tag(:span, "Status", class: "font-medium text-slate-600") +
                  content_tag(:span, class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800") do
                    "Active"
                  end
                end +
                content_tag(:div, class: "flex justify-between py-3 border-b border-slate-100") do
                  content_tag(:span, "Created", class: "font-medium text-slate-600") +
                  content_tag(:span, "Jan 15, 2024", class: "text-slate-900")
                end +
                content_tag(:div, class: "flex justify-between py-3") do
                  content_tag(:span, "Members", class: "font-medium text-slate-600") +
                  content_tag(:span, "24 users", class: "text-slate-900")
                end
              end
            end
          end +
          
          # Stats card
          content_tag(:div, class: "space-y-6") do
            content_tag(:div, class: "bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200") do
              content_tag(:h3, "Quick Stats", class: "text-lg font-semibold text-blue-900 mb-4") +
              content_tag(:div, class: "space-y-3") do
                content_tag(:div, class: "flex items-center justify-between") do
                  content_tag(:span, "Active Projects", class: "text-blue-700") +
                  content_tag(:span, "12", class: "font-bold text-blue-900")
                end +
                content_tag(:div, class: "flex items-center justify-between") do
                  content_tag(:span, "Total Revenue", class: "text-blue-700") +
                  content_tag(:span, "$45,230", class: "font-bold text-blue-900")
                end +
                content_tag(:div, class: "flex items-center justify-between") do
                  content_tag(:span, "Growth", class: "text-blue-700") +
                  content_tag(:span, "+12.5%", class: "font-bold text-green-600")
                end
              end
            end
          end
        end
      end
    end
  end

  def user_content
    content_tag :div, class: "p-6" do
      content_tag(:h1, "User Profile", class: "text-2xl font-bold text-gray-900 mb-4") +
      content_tag(:div, class: "bg-white rounded-lg shadow p-4") do
        content_tag(:h2, content_name, class: "text-lg font-semibold mb-2") +
        content_tag(:p, "User ID: #{content_id}", class: "text-gray-600 mb-2") +
        content_tag(:p, "User profile information and settings.", class: "text-gray-600")
      end
    end
  end

  def campaign_content
    content_tag :div, class: "p-6" do
      content_tag(:h1, "Campaign Management", class: "text-2xl font-bold text-gray-900 mb-4") +
      content_tag(:div, class: "bg-white rounded-lg shadow p-4") do
        content_tag(:h2, content_name, class: "text-lg font-semibold mb-2") +
        content_tag(:p, "Campaign ID: #{content_id}", class: "text-gray-600 mb-2") +
        content_tag(:p, "Campaign analytics and management tools.", class: "text-gray-600")
      end
    end
  end

  def report_content
    content_tag :div, class: "p-6" do
      content_tag(:h1, "Analytics Report", class: "text-2xl font-bold text-gray-900 mb-4") +
      content_tag(:div, class: "bg-white rounded-lg shadow p-4") do
        content_tag(:h2, content_name, class: "text-lg font-semibold mb-2") +
        content_tag(:p, "Report ID: #{content_id}", class: "text-gray-600 mb-2") +
        content_tag(:p, "Detailed analytics and reporting data.", class: "text-gray-600")
      end
    end
  end

  def dashboard_content
    content_tag :div, class: "p-6" do
      content_tag(:h1, "Dashboard", class: "text-2xl font-bold text-gray-900 mb-4") +
      content_tag(:div, class: "bg-white rounded-lg shadow p-4") do
        content_tag(:h2, content_name, class: "text-lg font-semibold mb-2") +
        content_tag(:p, "Dashboard ID: #{content_id}", class: "text-gray-600 mb-2") +
        content_tag(:p, "Interactive dashboard with real-time data.", class: "text-gray-600")
      end
    end
  end

  def settings_content
    content_tag :div, class: "p-6" do
      content_tag(:h1, "Settings", class: "text-2xl font-bold text-gray-900 mb-4") +
      content_tag(:div, class: "bg-white rounded-lg shadow p-4") do
        content_tag(:h2, content_name, class: "text-lg font-semibold mb-2") +
        content_tag(:p, "Settings ID: #{content_id}", class: "text-gray-600 mb-2") +
        content_tag(:p, "Application and user preference settings.", class: "text-gray-600")
      end
    end
  end

  def default_content
    content_tag :div, class: "p-6" do
      content_tag(:h1, "Content View", class: "text-2xl font-bold text-gray-900 mb-4") +
      content_tag(:div, class: "bg-white rounded-lg shadow p-4") do
        content_tag(:h2, content_name, class: "text-lg font-semibold mb-2") +
        content_tag(:p, "Content ID: #{content_id}", class: "text-gray-600 mb-2") +
        content_tag(:p, "Generic content view.", class: "text-gray-600")
      end
    end
  end
end