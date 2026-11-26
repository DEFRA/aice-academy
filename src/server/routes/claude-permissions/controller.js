import { getPageHtml } from '#/server/common/helpers/content/content.js'

/**
 * Explains what to do when Claude asks permission.
 */
export const claudePermissionsController = {
  handler(_request, h) {
    return h.view('claude-permissions/index', {
      pageTitle: 'When Claude asks permission',
      heading: 'When Claude asks permission',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'When Claude asks permission' }
      ],
      contentHtml: getPageHtml('claude-permissions')
    })
  }
}
