import { injectInlineSvg } from './svgAssets'

const MOBILE_NAV_BREAKPOINT = '(max-width: 900px)'

export function setupResponsiveNavMenu(): void {
  const siteNav = document.querySelector('.siteNav')
  const menuButton = document.querySelector('.navMenuButton')
  const primaryNavLinks = document.getElementById('primaryNavLinks')
  const menuButtonIcon = menuButton?.querySelector('.navMenuIcon')

  if (
    !(siteNav instanceof HTMLElement) ||
    !(menuButton instanceof HTMLButtonElement) ||
    !(primaryNavLinks instanceof HTMLUListElement) ||
    !(menuButtonIcon instanceof HTMLElement)
  ) {
    return
  }

  if (siteNav.dataset.menuInitialized === 'true') {
    return
  }
  siteNav.dataset.menuInitialized = 'true'

  const mobileMenuQuery = window.matchMedia(MOBILE_NAV_BREAKPOINT)
  const menuIconPath = menuButtonIcon.dataset.svgClosed ?? 'media/svg/menu.svg'
  const closeIconPath = menuButtonIcon.dataset.svgOpen ?? 'media/svg/close-button.svg'
  let currentMenuIconAsset = ''
  let isMenuOpen = false
  let lastFocusedElement: HTMLElement | null = null

  const getFocusableMenuElements = (): HTMLElement[] => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    return Array.from(primaryNavLinks.querySelectorAll<HTMLElement>(selectors))
      .filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
  }

  const setMenuIcon = (assetPath: string): void => {
    if (currentMenuIconAsset === assetPath) {
      return
    }

    currentMenuIconAsset = assetPath
    injectInlineSvg(menuButtonIcon, assetPath).catch(() => {
      menuButtonIcon.replaceChildren()
    })
  }

  const setMenuState = (isOpen: boolean): void => {
    isMenuOpen = isOpen
    siteNav.classList.toggle('isMenuOpen', isOpen)
    primaryNavLinks.hidden = !isOpen
    menuButton.setAttribute('aria-expanded', String(isOpen))
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    )
    setMenuIcon(isOpen ? closeIconPath : menuIconPath)

    if (isOpen) {
      lastFocusedElement = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButton

      window.requestAnimationFrame(() => {
        const focusable = getFocusableMenuElements()
        if (focusable.length > 0) {
          focusable[0].focus()
        }
      })
      return
    }

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus()
    } else {
      menuButton.focus()
    }
  }

  setMenuState(false)

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation()
    setMenuState(!isMenuOpen)
  })

  primaryNavLinks.addEventListener('click', (event) => {
    const target = event.target
    if (target instanceof Element && target.closest('a')) {
      setMenuState(false)
    }
  })

  document.addEventListener('click', (event) => {
    if (!isMenuOpen) {
      return
    }

    const target = event.target
    if (target instanceof Node && !siteNav.contains(target)) {
      setMenuState(false)
    }
  })

  document.addEventListener('keydown', (event) => {
    if (!isMenuOpen) {
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setMenuState(false)
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusable = getFocusableMenuElements()
    if (focusable.length === 0) {
      event.preventDefault()
      menuButton.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  })

  mobileMenuQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      setMenuState(false)
    }
  })
}
