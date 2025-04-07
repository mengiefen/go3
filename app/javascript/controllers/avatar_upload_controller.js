import { Controller } from '@hotwired/stimulus';
import { DirectUpload } from '@rails/activestorage';

/**
 * Avatar Upload Controller
 *
 * Handles file uploads for profile pictures with:
 * - Image preview
 * - Upload progress indication
 * - Direct uploads to storage provider
 */
export default class extends Controller {
  static targets = ['input', 'preview', 'progress', 'progressBar'];

  connect() {
    if (this.hasInputTarget && this.hasPreviewTarget) {
      this.inputTarget.addEventListener('change', this.handleFileSelect.bind(this));
    }
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show file preview
    this.previewFile(file);

    // If direct upload is enabled
    if (this.inputTarget.hasAttribute('data-direct-upload-url')) {
      this.uploadFile(file);
    }
  }

  previewFile(file) {
    // Only preview images
    if (!file.type.match('image.*')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Update the preview image
      if (this.previewTarget.tagName === 'IMG') {
        this.previewTarget.src = event.target.result;
      } else {
        // If preview target is not an image, find or create one
        let img = this.previewTarget.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          img.className = 'w-full h-full object-cover';
          this.previewTarget.innerHTML = '';
          this.previewTarget.appendChild(img);
        }
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  uploadFile(file) {
    // Only proceed if we have progress targets
    if (!this.hasProgressTarget || !this.hasProgressBarTarget) return;

    // Show progress bar
    this.progressTarget.classList.remove('hidden');

    // Create direct upload controller
    const upload = new DirectUpload(file, this.inputTarget.dataset.directUploadUrl, this);

    // Start upload
    upload.create((error, blob) => {
      if (error) {
        // Handle the error
        console.error('Direct upload error:', error);
      } else {
        // Add the blob ID to a hidden field
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('value', blob.signed_id);
        hiddenField.name = this.inputTarget.name;
        this.inputTarget.parentNode.insertBefore(hiddenField, this.inputTarget.nextSibling);
      }

      // Hide progress bar after upload completes
      setTimeout(() => {
        this.progressTarget.classList.add('hidden');
      }, 1500);
    });
  }

  // DirectUpload delegate methods
  directUploadWillStoreFileWithXHR(xhr) {
    xhr.upload.addEventListener('progress', (event) => {
      const progress = (event.loaded / event.total) * 100;
      this.progressBarTarget.style.width = `${progress}%`;
    });
  }
}
