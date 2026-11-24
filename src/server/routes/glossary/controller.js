import escape from 'lodash/escape.js'

import { getGlossary } from '#/server/common/helpers/content/content.js'

/**
 * Summary list rows for the glossary. Content is escaped before it is
 * placed in the html option.
 */
export function buildGlossaryRows(glossary) {
  return glossary.map(({ term, meaning, comparison }) => ({
    key: { text: term },
    value: {
      html: `<p class="govuk-body">${escape(meaning)}</p><p class="govuk-body govuk-hint">Think of it as: ${escape(comparison)}</p>`
    }
  }))
}

export const glossaryController = {
  handler(_request, h) {
    return h.view('glossary/index', {
      pageTitle: 'Glossary',
      heading: 'Glossary',
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Glossary' }],
      rows: buildGlossaryRows(getGlossary())
    })
  }
}
