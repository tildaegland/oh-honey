import { startLoaderAnimation } from './ts/loaderAnimation'
import { setupResponsiveNavMenu } from './ts/navMenu'
import { loadInlineSvgAssets } from './ts/svgAssets'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

loadInlineSvgAssets()
startLoaderAnimation(() => {
  setupResponsiveNavMenu()
})
