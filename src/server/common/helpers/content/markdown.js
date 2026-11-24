import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/**
 * GOV.UK Frontend classes added to each HTML element produced from markdown.
 * Content authors can't set classes themselves: any class in the markdown is removed.
 */
const govukClasses = {
  h2: 'govuk-heading-m',
  h3: 'govuk-heading-s',
  p: 'govuk-body',
  ul: 'govuk-list govuk-list--bullet',
  ol: 'govuk-list govuk-list--number',
  a: 'govuk-link',
  table: 'govuk-table',
  thead: 'govuk-table__head',
  tbody: 'govuk-table__body',
  tr: 'govuk-table__row',
  th: 'govuk-table__header',
  td: 'govuk-table__cell',
  code: 'app-code',
  pre: 'app-code-block'
}

const allowedTags = [...Object.keys(govukClasses), 'li', 'strong', 'em', 'br']

const sanitizeOptions = {
  allowedTags,
  allowedAttributes: {
    a: ['href', 'class'],
    ...Object.fromEntries(
      Object.keys(govukClasses)
        .filter((tag) => tag !== 'a')
        .map((tag) => [tag, ['class']])
    )
  },
  allowedClasses: Object.fromEntries(
    Object.entries(govukClasses).map(([tag, classes]) => [
      tag,
      classes.split(' ')
    ])
  ),
  allowedSchemes: ['https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href'],
  allowProtocolRelative: false,
  transformTags: Object.fromEntries(
    Object.entries(govukClasses).map(([tag, classes]) => [
      tag,
      (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, class: classes }
      })
    ])
  )
}

/**
 * Converts trusted-author markdown to safe HTML styled with GOV.UK Frontend classes.
 * Output is always sanitised, so it is safe to render with the Nunjucks `safe` filter.
 * @param {string} markdown
 * @returns {string}
 */
export function renderMarkdown(markdown = '') {
  const html = marked.parse(markdown, { async: false, gfm: true })
  return sanitizeHtml(html, sanitizeOptions).trim()
}
