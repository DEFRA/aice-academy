import { getPageHtml } from '#/server/common/helpers/content/content.js'

/**
 * Explains the team, the golden loop and the team rules.
 */
export const howItWorksController = {
  handler(_request, h) {
    return h.view('how-it-works/index', {
      pageTitle: 'How it works',
      heading: 'How it works',
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'How it works' }],
      contentHtml: getPageHtml('how-it-works')
    })
  }
}
