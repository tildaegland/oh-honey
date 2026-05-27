const ASSET_BASE_URL = import.meta.env.BASE_URL

const inlineSvgCache = new Map<string, Promise<string>>()

export function getSvgAssetUrl(assetPath: string): string {
  if (assetPath.startsWith('/')) {
    return `${ASSET_BASE_URL}${assetPath.slice(1)}`
  }
  return `${ASSET_BASE_URL}${assetPath}`
}

function fetchInlineSvg(assetPath: string): Promise<string> {
  const cached = inlineSvgCache.get(assetPath)
  if (cached) {
    return cached
  }

  const request = fetch(getSvgAssetUrl(assetPath)).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch SVG: ${assetPath}`)
    }
    return res.text()
  })

  inlineSvgCache.set(assetPath, request)
  return request
}

function parseInlineSvg(svgText: string): SVGSVGElement | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, 'image/svg+xml')
  const svg = doc.querySelector('svg')

  if (!(svg instanceof SVGSVGElement)) {
    return null
  }

  svg.setAttribute('focusable', 'false')
  svg.setAttribute('aria-hidden', 'true')
  return svg
}

export function injectInlineSvg(container: HTMLElement, assetPath: string): Promise<void> {
  return fetchInlineSvg(assetPath).then((svgText) => {
    const svg = parseInlineSvg(svgText)
    if (!svg) {
      return
    }

    container.replaceChildren(svg)
    container.dataset.inlineSvg = assetPath
  })
}

export function loadInlineSvgAssets(): void {
  const inlineTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-inline-svg]'))

  inlineTargets.forEach((target) => {
    const assetPath = target.dataset.inlineSvg
    if (!assetPath) {
      return
    }

    injectInlineSvg(target, assetPath).catch(() => {
      target.replaceChildren()
    })
  })
}
