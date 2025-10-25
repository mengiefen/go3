export default class TabsSystemComponent {
  tabs = []
  currentTab = null

  handleTurboClick(e) {
    e.preventDefault()
    e.detail.originalEvent.preventDefault()
    const url = e.detail.url
    const tab = this.tabs.find((t) => t.path === url)
    const srcElement = e.target
    if (tab) {
      this.currentTab = tab
    } else {
      const newTab = { title: 'Loading...', path: url, key: srcElement.dataset.tab, loading: true }
      this.tabs.push(newTab)
      this.currentTab = newTab
    }
    history.replaceState(history.state, '', this.currentTab.path)
    if(!this.$root.querySelector(`turbo-frame[data-path='${this.currentTab.path}']`)) {
      this.createTabFrame(this.currentTab)
    }
  }

  async onFrameRender(e) {
    const path = e.target.dataset.path
    const tab = this.tabs.find((t) => t.path === path)
    if (tab) {
      tab.loading = false
      const title = (await e.detail.fetchResponse.responseHTML).match(/<meta\s+?name="tab-title"\s+?content="(.*?)">/)?.[1]
      tab.title = title || 'No Title'
    }
  }

  switchTab(tab) {
    this.currentTab = tab
    history.replaceState(history.state, '', tab.path)
    if(!this.$root.querySelector(`turbo-frame[data-path='${tab.path}']`)) {
      this.createTabFrame(tab)
    }
  }

  closeTab(tab) {
    const tabIndex = this.tabs.findIndex((t) => t.path === tab.path)
    const frame = this.$root.querySelector(`turbo-frame[data-path='${tab.path}']`)
    if (frame) {
      frame.remove()
    }
    this.tabs = this.tabs.filter((t) => t.path !== tab.path)
    if (this.currentTab.path === tab.path) {
      if (this.tabs.length > 0) {
        const newIndex = tabIndex > 0 ? tabIndex - 1 : 0
        this.currentTab = this.tabs[newIndex]
        history.replaceState(history.state, '', this.currentTab.path)
      } else {
        this.currentTab = null
        history.replaceState(history.state, '', '/')
      }
    }
  }

  createTabFrame(tab) {
    const frame = document.createElement('turbo-frame')
    frame.setAttribute('id', tab.key)
    frame.setAttribute('src', tab.path)
    frame.setAttribute('x-show', `currentTab.path === '${tab.path}'`)
    frame.dataset.path = tab.path
    this.$refs.tabContent.appendChild(frame)
    return frame
  }

  init() {
    const tabs = JSON.parse(localStorage.getItem('tabsSystemComponentTabs')) || []
    const currentTab = JSON.parse(this.$root.dataset.paramCurrentTab)
    this.currentTab = currentTab || (tabs.length > 0 ? tabs.at(-1) : null)
    this.tabs = tabs
    if (this.currentTab) {
      this.currentTab.loading = false
      if (!this.tabs.find((tab) => tab.path === this.currentTab.path)) {
        this.tabs.push(this.currentTab)
      }
    }
  }
}
