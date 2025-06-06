# filepath: /home/baloz/uV/side-projects/Collab/go3/app/components/ui/modal_component.rb
module Ui
  class ModalComponent < ViewComponent::Base
    renders_one :header
    renders_one :body
    renders_one :footer
    
    attr_reader :id, :title, :size, :full_screen
    
    def initialize(id:, title: nil, size: :md, full_screen: false)
      @id = id
      @title = title
      @size = size
      @full_screen = full_screen
    end
    
    def modal_size_class
      case @size
      when :sm then "max-w-sm"
      when :md then "max-w-md"
      when :lg then "max-w-lg"
      when :xl then "max-w-xl"
      when :"2xl" then "max-w-2xl"
      when :"3xl" then "max-w-3xl"
      when :"4xl" then "max-w-4xl"
      when :"5xl" then "max-w-5xl"
      when :"6xl" then "max-w-6xl"
      when :"7xl" then "max-w-7xl"
      when :full then "max-w-full"
      else "max-w-md"
      end
    end
    
    def full_screen_classes
      @full_screen ? "fixed inset-0 p-0" : "relative p-6"
    end
  end
end
