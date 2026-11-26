import { getGlossary } from '#/server/common/helpers/content/content.js'

/**
 * Glossary terms in alphabetical order, each with an id other pages link to.
 */
export function buildGlossaryTerms(glossary) {
  return [...glossary].sort((a, b) => a.term.localeCompare(b.term, 'en-GB'))
}

export const glossaryController = {
  handler(_request, h) {
    return h.view('glossary/index', {
      pageTitle: 'Glossary',
      heading: 'Words you might meet',
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Glossary' }],
      terms: buildGlossaryTerms(getGlossary())
    })
  }
}
