import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'handle'];
  static values = {
    direction: { type: String, default: 'horizontal' },
    minSize: { type: Number, default: 200 },
    maxSize: { type: Number, default: 600 },
    defaultSize: { type: Number, default: 300 },
    handlePosition: { type: String, default: 'end' },
    persistSize: { type: Boolean, default: true },
    storageKey: { type: String, default: 'resizable_panel' }
  };

  connect() {
    this.isResizing = false;
    this.setupPanel();
    this.loadSavedSize();
    this.setupEventListeners();
  }

  disconnect() {
    this.removeEventListeners();
  }

  setupPanel() {
    // Ensure panel has relative positioning for handle
    if (this.hasPanelTarget) {
      this.panelTarget.style.position = 'relative';
    }
  }

  loadSavedSize() {
    if (!this.persistSizeValue) return;
    
    const savedSize = localStorage.getItem(this.storageKeyValue);
    if (savedSize) {
      const size = parseInt(savedSize, 10);
      if (size >= this.minSizeValue && size <= this.maxSizeValue) {
        this.setSize(size);
      }
    }
  }

  setupEventListeners() {
    // Bind methods
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
    
    // Mouse events
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
    
    // Touch events for mobile
    document.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    document.addEventListener('touchend', this.boundTouchEnd);
  }

  removeEventListeners() {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    document.removeEventListener('touchmove', this.boundTouchMove);
    document.removeEventListener('touchend', this.boundTouchEnd);
  }

  startResize(event) {
    event.preventDefault();
    this.isResizing = true;
    
    // Get initial position
    if (event.type === 'mousedown') {
      this.startPos = this.isHorizontal() ? event.clientX : event.clientY;
    } else if (event.type === 'touchstart') {
      const touch = event.touches[0];
      this.startPos = this.isHorizontal() ? touch.clientX : touch.clientY;
    }
    
    // Get initial size
    this.startSize = this.getCurrentSize();
    
    // Add resizing class for visual feedback
    document.body.classList.add('resizing');
    document.body.style.userSelect = 'none';
    
    if (this.isHorizontal()) {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'row-resize';
    }
    
    // Add active state to handle
    if (this.hasHandleTarget) {
      this.handleTarget.classList.add('bg-blue-500/40', 'dark:bg-blue-400/40');
    }
  }

  handleMouseMove(event) {
    if (!this.isResizing) return;
    this.resize(event.clientX, event.clientY);
  }

  handleMouseUp() {
    if (!this.isResizing) return;
    this.stopResize();
  }

  handleTouchMove(event) {
    if (!this.isResizing) return;
    event.preventDefault();
    const touch = event.touches[0];
    this.resize(touch.clientX, touch.clientY);
  }

  handleTouchEnd() {
    if (!this.isResizing) return;
    this.stopResize();
  }

  resize(clientX, clientY) {
    const currentPos = this.isHorizontal() ? clientX : clientY;
    let delta = currentPos - this.startPos;
    
    // Adjust delta based on handle position
    if (this.handlePositionValue === 'start') {
      delta = -delta;
    }
    
    // Calculate new size
    let newSize = this.startSize + delta;
    
    // Apply constraints
    newSize = Math.max(this.minSizeValue, Math.min(this.maxSizeValue, newSize));
    
    // Apply size
    this.setSize(newSize);
    
    // Dispatch resize event
    this.dispatch('resize', { detail: { size: newSize } });
  }

  stopResize() {
    this.isResizing = false;
    
    // Remove visual feedback
    document.body.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Remove active state from handle
    if (this.hasHandleTarget) {
      this.handleTarget.classList.remove('bg-blue-500/40', 'dark:bg-blue-400/40');
    }
    
    // Save size if persistence is enabled
    if (this.persistSizeValue) {
      const currentSize = this.getCurrentSize();
      localStorage.setItem(this.storageKeyValue, currentSize.toString());
    }
    
    // Dispatch resize end event
    this.dispatch('resize:end', { detail: { size: this.getCurrentSize() } });
  }

  getCurrentSize() {
    if (this.hasPanelTarget) {
      return this.isHorizontal() 
        ? this.panelTarget.offsetWidth 
        : this.panelTarget.offsetHeight;
    }
    return this.defaultSizeValue;
  }

  setSize(size) {
    if (this.hasPanelTarget) {
      if (this.isHorizontal()) {
        this.panelTarget.style.width = `${size}px`;
      } else {
        this.panelTarget.style.height = `${size}px`;
      }
    }
  }

  isHorizontal() {
    return this.directionValue === 'horizontal';
  }

  // Touch event handlers
  handleTouchStart(event) {
    this.startResize(event);
  }

  // Public methods for external control
  collapse() {
    const minSize = this.isHorizontal() ? 50 : 40;
    this.setSize(minSize);
    this.dispatch('collapse');
  }

  expand() {
    this.setSize(this.defaultSizeValue);
    this.dispatch('expand');
  }

  toggleCollapse() {
    const currentSize = this.getCurrentSize();
    const minSize = this.isHorizontal() ? 50 : 40;
    
    if (currentSize <= minSize) {
      this.expand();
    } else {
      this.collapse();
    }
  }
}