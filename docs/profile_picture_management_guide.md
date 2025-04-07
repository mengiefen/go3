# Profile Picture Management & Active Storage Guide

## Overview

This guide covers the profile picture management feature implemented in the GO3 Platform and provides instructions for configuring different cloud storage providers for Active Storage as your application scales. It includes detailed technical implementation notes to help developers understand, maintain, and extend this feature.

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Using Profile Pictures](#using-profile-pictures)
3. [Implementation Details](#implementation-details)
   - [Key Files and Components](#key-files-and-components)
   - [Database Structure](#database-structure)
   - [Model Implementation](#model-implementation)
   - [Controller Implementation](#controller-implementation)
   - [View Implementation](#view-implementation)
   - [JavaScript Implementation](#javascript-implementation)
4. [Cloud Storage Configuration](#cloud-storage-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Future Enhancements](#future-enhancements)
7. [Development Guidelines](#development-guidelines)
8. [Testing](#testing)
9. [Performance Considerations](#performance-considerations)

## Feature Overview

The profile picture management feature allows users to:

- Upload a profile picture from their device
- See a preview of their uploaded image before saving
- Remove their current profile picture
- Have their profile picture automatically imported from OAuth providers (Google, LinkedIn)
- See their profile picture displayed throughout the application (header, profile page, etc.)

The system uses Active Storage for handling file uploads, image transformations, and storage. It's configured to be cloud-provider agnostic, allowing easy switching between storage services.

## Using Profile Pictures

### Uploading a Profile Picture

1. Log in to your account
2. Navigate to "Your Profile" from the dropdown menu
3. Click the "Edit Profile" button
4. In the profile picture section, click "Choose File" or the file input area
5. Select an image from your device (supported formats: JPG, PNG, GIF)
6. Preview your image in the circular display
7. Click "Update Profile" to save your changes

### Removing a Profile Picture

1. Navigate to "Your Profile" > "Edit Profile"
2. Click the "Remove current picture" link below your profile picture
3. Confirm the removal when prompted
4. Your profile will revert to displaying the default avatar

### Size and Format Requirements

- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF
- Images will be automatically resized for different display contexts

## Implementation Details

### Key Files and Components

The profile picture management feature involves several key files:

- **Models**:
  - `app/models/user.rb` - Contains the Active Storage attachment declaration and validation logic
  
- **Controllers**:
  - `app/controllers/users/profiles_controller.rb` - Handles profile updates and avatar removal
  
- **Views**:
  - `app/views/users/profiles/edit.html.erb` - Contains the avatar upload form
  - `app/views/users/profiles/show.html.erb` - Displays the user's profile picture
  - `app/views/layouts/application.html.erb` - Displays the user's avatar in the header

- **JavaScript**:
  - `app/javascript/controllers/avatar_upload_controller.js` - Stimulus controller for handling uploads

- **Assets**:
  - `public/images/default_avatar.svg` - Default avatar shown when no profile picture exists

- **Configuration**:
  - `config/storage.yml` - Storage service configuration
  - `config/application.rb` - Active Storage configuration
  - `config/environments/*.rb` - Environment-specific storage settings

### Database Structure

Active Storage uses three tables for managing file attachments:

1. `active_storage_blobs` - Stores metadata for each file
2. `active_storage_attachments` - Polymorphic join table that connects records to their attachments
3. `active_storage_variant_records` - Stores variants of original blobs

The migration that creates these tables is at `db/migrate/20250407184056_create_active_storage_tables.active_storage.rb`.

### Model Implementation

In the User model (`app/models/user.rb`), the avatar attachment is defined with:

```ruby
# Active Storage attachment
has_one_attached :avatar
```

Validation for the avatar is implemented with:

```ruby
validate :acceptable_avatar, if: -> { avatar.attached? }

# Validate avatar file type and size
def acceptable_avatar
  # Check file size
  if avatar.blob.byte_size > 5.megabytes
    errors.add(:avatar, "is too large - should be less than 5MB")
    avatar.purge
  end
  
  # Check file type
  acceptable_types = ["image/jpeg", "image/png", "image/gif"]
  unless acceptable_types.include?(avatar.blob.content_type)
    errors.add(:avatar, "must be a JPEG, PNG, or GIF file")
    avatar.purge
  end
end
```

Helper methods are provided for different avatar use cases:

```ruby
def avatar_url
  if avatar.attached?
    Rails.application.routes.url_helpers.rails_blob_url(avatar)
  else
    # Return default avatar URL
    "/images/default_avatar.svg"
  end
end

def avatar_thumbnail
  return nil unless avatar.attached?
  avatar.variant(resize_to_fill: [100, 100]).processed
end

def avatar_medium
  return nil unless avatar.attached?
  avatar.variant(resize_to_fill: [300, 300]).processed
end

# Import avatar from OAuth provider's image URL
def import_avatar_from_url(url)
  return if url.blank?
  
  begin
    # Download the image from the URL
    downloaded_image = URI.open(url)
    
    # Attach the downloaded image as the avatar
    avatar.attach(io: downloaded_image, filename: "avatar-#{Time.current.to_i}.jpg")
    return true
  rescue => e
    Rails.logger.error("Failed to import avatar from URL: #{e.message}")
    return false
  end
end
```

### Controller Implementation

The Profiles Controller handles avatar uploads and removal:

```ruby
# In app/controllers/users/profiles_controller.rb
def update
  if current_user.update(user_params)
    redirect_to users_profile_path, notice: 'Profile updated successfully'
  else
    render :edit, status: :unprocessable_entity
  end
end

def remove_avatar
  current_user.avatar.purge
  redirect_to users_profile_path, notice: 'Profile picture removed'
end

private

def user_params
  params.require(:user).permit(:first_name, :last_name, :avatar, :timezone, :language, :address, :phone_number)
end
```

The route for avatar removal:

```ruby
# In config/routes.rb
namespace :users do
  resource :profile, only: [:show, :edit, :update]
  delete 'remove_avatar', to: 'profiles#remove_avatar'
end
```

### View Implementation

The profile edit view includes a form for avatar upload:

```erb
<div class="flex flex-col items-center sm:flex-row sm:items-start">
  <div class="mb-4 sm:mb-0 sm:mr-6">
    <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-300" data-avatar-upload-target="preview">
      <% if current_user.avatar.attached? %>
        <%= image_tag current_user.avatar.variant(resize_to_fill: [128, 128]), class: "w-full h-full object-cover" %>
      <% else %>
        <!-- Default avatar SVG -->
      <% end %>
    </div>
  </div>
  
  <div class="flex-1" data-controller="avatar-upload">
    <!-- File input and preview logic -->
    <%= form.file_field :avatar, 
        accept: "image/jpeg,image/png,image/gif", 
        direct_upload: true,
        data: { 
          avatar_upload_target: "input"
        } %>
    
    <!-- Progress bar and remove link -->
  </div>
</div>
```

### JavaScript Implementation

The Stimulus controller (`app/javascript/controllers/avatar_upload_controller.js`) handles direct uploads and image previews:

```javascript
import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"

export default class extends Controller {
  static targets = ["input", "preview", "progress", "progressBar"]
  
  connect() {
    if (this.hasInputTarget && this.hasPreviewTarget) {
      this.inputTarget.addEventListener("change", this.handleFileSelect.bind(this))
    }
  }
  
  handleFileSelect(event) {
    const file = event.target.files[0]
    if (!file) return
    
    // Show file preview
    this.previewFile(file)
    
    // If direct upload is enabled
    if (this.inputTarget.hasAttribute("data-direct-upload-url")) {
      this.uploadFile(file)
    }
  }
  
  // Other methods including previewFile, uploadFile, directUploadWillStoreFileWithXHR...
}
```

## Cloud Storage Configuration

The application is configured to work with multiple cloud storage providers through Active Storage. By default:

- **Development**: Uses local disk storage
- **Production**: Configurable through environment variables

### Available Storage Services

#### Local Disk (Default for Development)

No additional configuration required. Files are stored in the `storage/` directory.

#### Amazon S3

To use Amazon S3 for storing profile pictures:

1. Set up an AWS S3 bucket and IAM user with appropriate permissions
2. Configure environment variables:

```
ACTIVE_STORAGE_SERVICE=amazon
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET=your_bucket_name
```

#### Google Cloud Storage

To use Google Cloud Storage:

1. Create a GCS bucket and service account
2. Configure environment variables:

```
ACTIVE_STORAGE_SERVICE=google
GOOGLE_PROJECT=your_project_id
GOOGLE_CREDENTIALS=path_to_keyfile_or_json_credentials
GOOGLE_BUCKET=your_bucket_name
```

#### Microsoft Azure Storage

To use Azure Storage:

1. Create an Azure Storage account and container
2. Configure environment variables:

```
ACTIVE_STORAGE_SERVICE=microsoft
AZURE_STORAGE_ACCOUNT_NAME=your_account_name
AZURE_STORAGE_ACCESS_KEY=your_access_key
AZURE_STORAGE_CONTAINER=your_container_name
```

### Configuration File Structure

The `config/storage.yml` file defines all available storage services:

```yaml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>

amazon:
  service: S3
  access_key_id: <%= ENV["AWS_ACCESS_KEY_ID"] %>
  secret_access_key: <%= ENV["AWS_SECRET_ACCESS_KEY"] %>
  region: <%= ENV["AWS_REGION"] %>
  bucket: <%= ENV["AWS_BUCKET"] %>

google:
  service: GCS
  project: <%= ENV["GOOGLE_PROJECT"] %>
  credentials: <%= ENV["GOOGLE_CREDENTIALS"] %>
  bucket: <%= ENV["GOOGLE_BUCKET"] %>

microsoft:
  service: AzureStorage
  storage_account_name: <%= ENV["AZURE_STORAGE_ACCOUNT_NAME"] %>
  storage_access_key: <%= ENV["AZURE_STORAGE_ACCESS_KEY"] %>
  container: <%= ENV["AZURE_STORAGE_CONTAINER"] %>
```

The active storage service is configured in environment files:

```ruby
# config/environments/production.rb
config.active_storage.service = ENV.fetch("ACTIVE_STORAGE_SERVICE", "amazon").to_sym
```

### Changing Storage Providers

To change the storage provider:

1. Configure the appropriate environment variables for your chosen provider
2. Set the `ACTIVE_STORAGE_SERVICE` environment variable to the provider name
3. Restart your application

No code changes are required as the configuration is handled through the `config/storage.yml` file.

### Migrating Existing Files

When switching storage providers, existing files need to be migrated. You can use the Active Storage migration rake task:

```bash
rails active_storage:migrate
```

This will copy files from the current storage service to the configured one.

## Troubleshooting

### Missing libvips Library

If you encounter errors about missing libvips libraries:

```
LoadError (Could not open library 'vips.so.42')
```

Install the required system dependencies:

```bash
# Ubuntu/Debian
sudo apt-get install libvips42

# CentOS/RHEL
sudo yum install vips-libs

# macOS
brew install vips
```

### Image Processing Issues

If image variants are not being created correctly:

1. Check that libvips or ImageMagick is installed correctly
2. Verify the Active Storage variant processor configuration
3. Check for proper storage service configuration

The variant processor can be configured in `config/application.rb`:

```ruby
config.active_storage.variant_processor = :vips  # or :mini_magick
```

### Common Error Scenarios

#### Missing Variants

If image variants don't appear:

```ruby
# Check if the variant is being processed correctly
blob = user.avatar.blob
variant = blob.variant(resize_to_fill: [100, 100])
variant.processed  # Should return the variant record
```

#### Disk Space Issues

For local storage, check disk space availability:

```bash
df -h
```

#### S3 Permission Issues

For S3, check that your IAM role has these permissions:

- s3:PutObject
- s3:GetObject
- s3:DeleteObject
- s3:ListBucket

## Future Enhancements

Planned enhancements for the profile picture management feature:

1. **Image Cropping**: Allow users to crop their profile picture during upload
2. **Animated GIF Support**: Better handling of animated GIFs as profile pictures
3. **Background Processing**: Move image transformation to background jobs
4. **CDN Integration**: Configure CDN delivery for faster image loading
5. **Advanced Image Metadata**: Extract and use image metadata for better organization

## Development Guidelines

### Adding New Avatar Sizes

To add a new standardized avatar size:

1. Add a new helper method to the User model:

```ruby
def avatar_large
  return nil unless avatar.attached?
  avatar.variant(resize_to_fill: [500, 500]).processed
end
```

2. Use the new method in views:

```erb
<%= image_tag user.avatar_large, class: "..." if user.avatar.attached? %>
```

### Implementing Image Cropping

To add client-side cropping functionality:

1. Add a JavaScript library like Cropper.js to your application
2. Modify the avatar_upload_controller.js to handle cropping
3. Update the controller to send the cropped image data

### Best Practices

1. **Always validate uploads**: Check file size and type on the server side
2. **Use background processing**: For large files, process variants in background jobs
3. **Implement CDN**: For production, configure a CDN for faster delivery
4. **Clean orphaned blobs**: Run `rails active_storage:purge_unattached` regularly

## Testing

### Model Testing

Test avatar validations and helper methods:

```ruby
# test/models/user_test.rb
test "should not save avatar with invalid file type" do
  user = users(:valid_user)
  file = fixture_file_upload('files/invalid.txt', 'text/plain')
  
  user.avatar.attach(file)
  assert_not user.save, "Saved avatar with invalid file type"
  assert_includes user.errors[:avatar], "must be a JPEG, PNG, or GIF file"
end

test "should not save avatar larger than 5MB" do
  # Similar test for file size validation
end

test "avatar_url returns default when no avatar attached" do
  user = users(:valid_user)
  assert_equal "/images/default_avatar.svg", user.avatar_url
end
```

### System Testing

Test the avatar upload UI:

```ruby
# test/system/profile_test.rb
test "user can upload and see profile picture" do
  sign_in users(:valid_user)
  visit edit_users_profile_path
  
  attach_file("user[avatar]", file_fixture("avatar.jpg"))
  click_button "Update Profile"
  
  assert_selector "img.profile-avatar"
  assert users(:valid_user).avatar.attached?
end
```

## Performance Considerations

### Image Optimization

- Use appropriate variant options to minimize file size
- Consider using WebP format for better compression:

```ruby
avatar.variant(resize_to_fill: [100, 100], format: :webp).processed
```

### Caching Strategies

- Use HTTP caching headers for avatar URLs
- Consider implementing fragment caching for profile components:

```erb
<% cache [user, 'avatar', user.avatar.attached? ? user.avatar.blob.updated_at : 'none'] do %>
  <%= image_tag user.avatar.variant(resize_to_fill: [100, 100]), class: "rounded-full" if user.avatar.attached? %>
<% end %>
```

### Direct Upload Configuration

For improved direct upload performance:

1. Configure Active Storage service for direct uploads
2. Use a CDN for serving assets
3. Consider client-side image resizing before upload

## Additional Resources

- [Rails Active Storage Guide](https://guides.rubyonrails.org/active_storage_overview.html)
- [libvips Documentation](https://libvips.github.io/libvips/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Azure Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/)

---

*Last updated: April 7, 2025*