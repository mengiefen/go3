import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static values = {
    minWidth: { type: Number, default: 200 },
    maxWidth: { type: Number, default: 500 },
  };

  connect() {
    this.initialWidth = this.element.offsetWidth;
    this.createResizeHandle();
  }

  disconnect() {
    if (this.resizeHandle) {
      this.resizeHandle.remove();
    }
  }

  createResizeHandle() {
    this.resizeHandle = document.createElement('div');
    this.resizeHandle.classList.add(
      'absolute',
      'top-0',
      'right-0',
      'h-full',
      'w-1',
      'cursor-col-resize',
      'z-10',
      'hover:bg-blue-500',
      'transition-colors',
      'duration-150'
    );

    this.element.style.position = 'relative';
    this.element.appendChild(this.resizeHandle);

    this.resizeHandle.addEventListener('mousedown', this.startResize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
    document.addEventListener('mousemove', this.resize.bind(this));
  }

  startResize(event) {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.element.offsetWidth;

    // Add a class to indicate resizing is in progress
    document.body.classList.add('resizing');
    this.resizeHandle.classList.add('bg-blue-500');

    event.preventDefault();
  }

  stopResize() {
    if (this.isResizing) {
      this.isResizing = false;
      document.body.classList.remove('resizing');
      this.resizeHandle.classList.remove('bg-blue-500');

      // Save the current width preference to localStorage
      localStorage.setItem('sidebarWidth', this.element.style.width);
    }
  }

  resize(event) {
    if (!this.isResizing) return;

    const width = this.startWidth + (event.clientX - this.startX);

    // Apply min/max constraints
    if (width >= this.minWidthValue && width <= this.maxWidthValue) {
      this.element.style.width = `${width}px`;
    }
  }
}
