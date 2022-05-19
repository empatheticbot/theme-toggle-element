const toggleTemplate = document.createElement('template')
toggleTemplate.innerHTML = `
  <aside>
    <input type="checkbox" id="theme-toggle">
    <label for="theme-toggle"></label>
  </aside>
`

enum ThemeStyle {
  Light = 'light',
  Dark = 'dark',
}

export class ThemeToggleElement extends HTMLElement {
  theme: ThemeStyle | null = null

  // eslint-disable-next-line custom-elements/no-constructor
  constructor() {
    super()
    this.handleLightTheme = this.handleLightTheme.bind(this)
    this.handleDarkTheme = this.handleDarkTheme.bind(this)
  }

  static get observedAttributes(): string[] {
    return []
  }

  connectedCallback(): void {
    const initialTheme = this.getInitialTheme()
    this.setThemeChangeListeners()
    console.log(initialTheme)
    const el = toggleTemplate.content.cloneNode(true)
    this.appendChild(el)
  }

  disconnectedCallback(): void {
    this.clearThemeChangeListeners()
  }

  handleLightTheme(event: MediaQueryListEvent): void {
    if (event.matches) {
      this.changeTheme(ThemeStyle.Light)
    }
  }

  handleDarkTheme(event: MediaQueryListEvent): void {
    if (event.matches) {
      this.changeTheme(ThemeStyle.Dark)
    }
  }

  setThemeChangeListeners(): void {
    if (matchMedia) {
      matchMedia('(prefers-color-scheme: dark)').addEventListener(
        'change',
        this.handleDarkTheme
      )
      matchMedia('(prefers-color-scheme: light)').addEventListener(
        'change',
        this.handleLightTheme
      )
    }
  }

  clearThemeChangeListeners(): void {
    if (matchMedia) {
      matchMedia('(prefers-color-scheme: dark)').removeEventListener(
        'change',
        this.handleDarkTheme
      )
      matchMedia('(prefers-color-scheme: light)').removeEventListener(
        'change',
        this.handleLightTheme
      )
    }
  }

  getInitialTheme(): ThemeStyle {
    const localStorageTheme = this.getLocalStorageTheme()
    if (localStorageTheme) {
      return localStorageTheme
    }
    if (matchMedia && matchMedia('(prefers-color-scheme: light)').matches) {
      return ThemeStyle.Light
    }
    if (matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
      return ThemeStyle.Dark
    }
    return ThemeStyle.Light
  }

  changeTheme(theme: ThemeStyle): void {
    this.setLocalStorageTheme(theme)
    document.querySelector('body')?.classList.remove('theme-dark')
    document.querySelector('body')?.classList.remove('theme-light')
    document.querySelector('body')?.classList.add(`theme-${theme}`)
  }

  getLocalStorageTheme(): ThemeStyle | null {
    if (localStorage) {
      const theme = localStorage.getItem('theme')
      if (theme) {
        return theme as ThemeStyle
      }
    }
    return null
  }

  setLocalStorageTheme(theme: ThemeStyle): void {
    if (localStorage) {
      localStorage.setItem('theme', theme)
    }
  }

  //   attributeChangedCallback(
  //     attrName: string,
  //     oldValue: string,
  //     newValue: string
  //   ): void {}
}

if (!customElements.get('theme-toggle')) {
  window.ThemeToggleElement = ThemeToggleElement
  customElements.define('theme-toggle', ThemeToggleElement)
}

declare global {
  interface Window {
    ThemeToggleElement: typeof ThemeToggleElement
  }
  interface HTMLElementTagNameMap {
    'theme-toggle': ThemeToggleElement
  }
}
