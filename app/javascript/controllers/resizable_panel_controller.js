import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static values = {
    minWidth: { type: Number, default: 200 },
    maxWidth: { type: Number, default: 500 },
    rtl: { type: Boolean, default: false }
  };

  connect() {
    this.initialWidth = this.element.offsetWidth;
    
    // Check if we're in an RTL layout
    this.isRTL = this.rtlValue || document.querySelector('html').dir === 'rtl' || 
                 this.element.closest('.rtl') !== null;
    
    this.createResizeHandle();
    
    // Load saved width from localStorage if available
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth && !this.element.classList.contains('panel-collapsed')) {
      this.element.style.width = savedWidth;
    }
  }

  disconnect() {
    if (this.resizeHandle) {
      this.resizeHandle.remove();
    }
    document.removeEventListener('mouseup', this.boundStopResize);
    document.removeEventListener('mousemove', this.boundResize);
  }

  createResizeHandle() {
    this.resizeHandle = document.createElement('div');
    
    // Position handle on the correct side based on RTL setting
    const handlePosition = this.isRTL ? 'left-0' : 'right-0';
    
    this.resizeHandle.classList.add(
      'absolute',
      'top-0',
      handlePosition,
      'h-full',
      'w-[1px]',
      'cursor-col-resize',
      'z-10',
      'transition-opacity',
      'duration-150',
      'opacity-0',
      'hover:opacity-100'
    );

    // Add subtle styling
    this.resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    
    this.element.style.position = 'relative';
    this.element.appendChild(this.resizeHandle);

    // Bind event handlers
    this.boundStartResize = this.startResize.bind(this);
    this.boundStopResize = this.stopResize.bind(this);
    this.boundResize = this.resize.bind(this);

    this.resizeHandle.addEventListener('mousedown', this.boundStartResize);
    document.addEventListener('mouseup', this.boundStopResize);
    document.addEventListener('mousemove', this.boundResize);
  }

  startResize(event) {
    // Don't resize if panel is collapsed
    if (this.element.classList.contains('panel-collapsed')) return;
    
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.element.offsetWidth;

    // Add visual feedback during resize
    document.body.classList.add('resizing');
    document.body.style.cursor = 'col-resize';
    this.resizeHandle.style.opacity = '1';

    event.preventDefault();
  }

  stopResize() {
    if (this.isResizing) {
      this.isResizing = false;
      document.body.classList.remove('resizing');
      document.body.style.cursor = '';
      this.resizeHandle.style.opacity = '0';

      // Save the current width preference to localStorage
      localStorage.setItem('sidebarWidth', this.element.style.width);
    }
  }

  resize(event) {
    if (!this.isResizing) return;

    let deltaX = event.clientX - this.startX;
    
    // Invert the direction for RTL
    if (this.isRTL) {
      deltaX = -deltaX;
    }
    
    const width = this.startWidth + deltaX;

    // Apply min/max constraints
    if (width >= this.minWidthValue && width <= this.maxWidthValue) {
      this.element.style.width = `${width}px`;
    }
  }
}
