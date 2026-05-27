import { gsap } from 'gsap'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo({ top: 0, left: 0, behavior: 'auto' })



const INTRO_BROWN = '#65350e'
const PAGE_FADE_DURATION = 1.4
const MOBILE_NAV_BREAKPOINT = '(max-width: 900px)'

let hasTransitionedToSite = false
let beeGroupEl: SVGGElement | null = null
let beeLoopTween: gsap.core.Tween | null = null

function setupResponsiveNavMenu(): void {
  const siteNav = document.querySelector('.siteNav')
  const menuButton = document.querySelector('.navMenuButton')
  const primaryNavLinks = document.getElementById('primaryNavLinks')
  const menuButtonIcon = menuButton?.querySelector('img')

  if (
    !(siteNav instanceof HTMLElement) ||
    !(menuButton instanceof HTMLButtonElement) ||
    !(primaryNavLinks instanceof HTMLUListElement) ||
    !(menuButtonIcon instanceof HTMLImageElement)
  ) {
    return
  }

  const mobileMenuQuery = window.matchMedia(MOBILE_NAV_BREAKPOINT)
  const menuIconPath = '/media/svg/menu.svg'
  const closeIconPath = '/media/svg/close-button.svg'

  const setMenuState = (isOpen: boolean): void => {
    siteNav.classList.toggle('isMenuOpen', isOpen)
    menuButton.setAttribute('aria-expanded', String(isOpen))
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    )
    menuButtonIcon.setAttribute('src', isOpen ? closeIconPath : menuIconPath)
  }

  setMenuState(false)

  menuButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.contains('isMenuOpen')
    setMenuState(!isOpen)
  })

  primaryNavLinks.addEventListener('click', (event) => {
    const target = event.target
    if (target instanceof Element && target.closest('a')) {
      setMenuState(false)
    }
  })

  document.addEventListener('click', (event) => {
    if (!siteNav.classList.contains('isMenuOpen')) {
      return
    }

    const target = event.target
    if (target instanceof Node && !siteNav.contains(target)) {
      setMenuState(false)
    }
  })

  mobileMenuQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      setMenuState(false)
    }
  })
}

function applyBasicFadeIn(frameEl: HTMLElement): void {
  frameEl.classList.add('is-loaded')
}

function stopBeeLoopAfterLoad(): void {
  if (beeLoopTween) {
    beeLoopTween.kill()
    beeLoopTween = null
  }

  if (beeGroupEl) {
    gsap.to(beeGroupEl, {
      y: 0,
      duration: 0.2,
      ease: 'sine.out'
    })
  }
}

function transitionLoaderToSite(): void {
  if (hasTransitionedToSite) {
    return
  }

  const loaderOverlay = document.getElementById('loaderOverlay')
  const siteContent = document.getElementById('siteContent')
  if (!(loaderOverlay instanceof HTMLElement) || !(siteContent instanceof HTMLElement)) {
    return
  }

  hasTransitionedToSite = true
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    siteContent.style.removeProperty('opacity')
    siteContent.style.removeProperty('visibility')
    loaderOverlay.classList.add('isHidden')
    siteContent.classList.add('isVisible')
    siteContent.removeAttribute('aria-hidden')
    stopBeeLoopAfterLoad()
    return
  }

  const timeline = gsap.timeline()
  timeline.set(siteContent, { visibility: 'visible', opacity: 0 })
  timeline.to(
    loaderOverlay,
    {
      opacity: 0,
      duration: PAGE_FADE_DURATION,
      delay: 0.35,
      ease: 'power2.inOut'
    },
    0
  )
  timeline.to(
    siteContent,
    {
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    },
    0.55
  )
  timeline.call(() => {
    siteContent.style.removeProperty('visibility')
    loaderOverlay.classList.add('isHidden')
    siteContent.classList.add('isVisible')
    siteContent.removeAttribute('aria-hidden')
    stopBeeLoopAfterLoad()
  })
}

function getTextPaths(svgEl: SVGSVGElement): SVGPathElement[] {
  const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path'))
  if (paths.length <= 5) {
    return paths
  }
  return paths.slice(0, -5)
}

function animateTextReveal(svgEl: SVGSVGElement): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const textPaths = getTextPaths(svgEl)

  if (reduceMotion) {
    textPaths.forEach((path) => {
      path.setAttribute('fill', INTRO_BROWN)
      path.setAttribute('stroke', 'none')
    })
    return
  }

  textPaths.forEach((path) => {
    const len = path.getTotalLength()
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', INTRO_BROWN)
    path.setAttribute('stroke-width', '1.5')
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`
    gsap.set(path, { opacity: 1 })
  })

  gsap.to(textPaths, {
    strokeDashoffset: 0,
    duration: 0.6,
    stagger: 0.09,
    ease: 'power2.inOut',
    delay: 0.1,
    onComplete: () => {
      gsap.to(textPaths, {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          textPaths.forEach((path) => {
            path.setAttribute('fill', INTRO_BROWN)
            path.setAttribute('stroke', INTRO_BROWN)
            path.setAttribute('stroke-width', '1')
            path.style.strokeDasharray = ''
            path.style.strokeDashoffset = ''
          })
          gsap.to(textPaths, { opacity: 1, duration: 0.15 })
        }
      })
    }
  })
}

function animateBeeIntro(
  svgEl: SVGSVGElement,
  onIntroComplete: () => void
): { beeGroup: SVGGElement } | null {
  const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path'))
  if (paths.length < 5) {
    return null
  }

  const beePaths = paths.slice(-5)
  const beeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  beeGroup.setAttribute('class', 'bee-group')
  svgEl.insertBefore(beeGroup, beePaths[0])

  beePaths.forEach((path) => beeGroup.appendChild(path))
  beePaths.forEach((path) => {
    const stroke = path.getAttribute('stroke')
    const fill = path.getAttribute('fill')

    if (stroke && stroke !== 'none') {
      path.setAttribute('stroke', INTRO_BROWN)
    }
    if (fill && fill !== 'none') {
      path.setAttribute('fill', INTRO_BROWN)
    }
  })

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startX = -(Math.max(window.innerWidth, svgEl.getBoundingClientRect().width || 0) + 120)

  if (reduceMotion) {
    gsap.set(beeGroup, { opacity: 1, x: 0, rotation: 0, scale: 1 })
    onIntroComplete()
    return { beeGroup }
  }

  gsap.fromTo(
    beeGroup,
    {
      opacity: 0,
      x: startX,
      rotation: -12,
      scale: 0.7,
      transformOrigin: '50% 50%',
      transformBox: 'fill-box'
    },
    {
      opacity: 1,
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 1.1,
      ease: 'back.out(1.6)',
      delay: 0.45,
      onComplete: () => {
        const endIntroTl = gsap.timeline()
        endIntroTl.to(document.body, {
          backgroundColor: '#ffffff',
          duration: 0.5,
          ease: 'power2.inOut'
        })
        endIntroTl.call(onIntroComplete, undefined, 0.25)
      }
    }
  )

  return { beeGroup }
}

function startBeeLoop(beeGroup: SVGGElement): void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    return
  }

  beeLoopTween = gsap.fromTo(
    beeGroup,
    { y: 0 },
    {
      y: 6,
      duration: 0.55,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.15
    }
  )
}

const frame = document.getElementById('svg-frame')

setupResponsiveNavMenu()

if (frame instanceof HTMLElement) {
  fetch('/media/svg/oh-honey.svg')
    .then((res) => res.text())
    .then((svgText) => {
      frame.innerHTML = svgText

      const svgEl = frame.querySelector<SVGSVGElement>('svg')
      if (!svgEl) {
        return
      }

      svgEl.setAttribute('width', '100%')
      svgEl.removeAttribute('height')
      svgEl.setAttribute('overflow', 'visible')
      svgEl.classList.add('logo-svg')
      svgEl.style.display = 'block'
      svgEl.style.height = 'auto'
      svgEl.style.overflow = 'visible'

      applyBasicFadeIn(frame)
      animateTextReveal(svgEl)
      const bee = animateBeeIntro(svgEl, transitionLoaderToSite)
      if (!bee) {
        transitionLoaderToSite()
        return
      }

      beeGroupEl = bee.beeGroup
      startBeeLoop(bee.beeGroup)
      window.setTimeout(transitionLoaderToSite, 5000)
    })
    .catch(() => {
      transitionLoaderToSite()
    })
}
