import './application.css'
import '@primer/view-components'
import '@hotwired/turbo-rails'
import 'alpine-turbo-drive-adapter'
import AsyncAlpine from 'async-alpine'
import Alpine from 'alpinejs'
import TabsSystemComponent from '../components/TabsSystemComponent'

window.Alpine = Alpine

Alpine.plugin(AsyncAlpine)
Alpine.data('tabsSystem', (...args) => new TabsSystemComponent(...args))
Alpine.start()

// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log('Vite ⚡️ Rails')

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails')

// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'
