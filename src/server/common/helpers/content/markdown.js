import { Marked } from 'marked'
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

const newTabText = /\(opens in new tab\)$/

const escapeAttribute = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')

/**
 * A heading's id, so pages can link to it: "Meet your team" becomes "meet-your-team".
 * @param {string} text
 */
export function headingId(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[#a-z0-9]+;/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const markdown = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const id = depth === 2 || depth === 3 ? ` id="${headingId(text)}"` : ''

      return `<h${depth}${id}>${text}</h${depth}>\n`
    },
    // Links whose text ends "(opens in new tab)" open in a new tab, as they say
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens)
      const newTab = newTabText.test(text)
        ? ' target="_blank" rel="noreferrer noopener"'
        : ''

      return `<a href="${escapeAttribute(href)}"${newTab}>${text}</a>`
    }
  }
})

const allowedTags = [...Object.keys(govukClasses), 'li', 'strong', 'em', 'br']

const sanitizeOptions = {
  allowedTags,
  allowedAttributes: {
    ...Object.fromEntries(
      Object.keys(govukClasses).map((tag) => [tag, ['class']])
    ),
    a: ['href', 'class', 'target', 'rel'],
    h2: ['class', 'id'],
    h3: ['class', 'id']
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
  transformTags: {
    ...Object.fromEntries(
      Object.entries(govukClasses).map(([tag, classes]) => [
        tag,
        (tagName, attribs) => ({
          tagName,
          attribs: { ...attribs, class: classes }
        })
      ])
    ),
    a: (tagName, { href, target }) => ({
      tagName,
      attribs: {
        ...(href ? { href } : {}),
        class: govukClasses.a,
        ...(target === '_blank'
          ? { target: '_blank', rel: 'noreferrer noopener' }
          : {})
      }
    })
  }
}

/**
 * Converts trusted-author markdown to safe HTML styled with GOV.UK Frontend classes.
 * Output is always sanitised, so it is safe to render with the Nunjucks `safe` filter.
 * @param {string} source
 * @returns {string}
 */
export function renderMarkdown(source = '') {
  const html = markdown.parse(source, { async: false })
  return sanitizeHtml(html, sanitizeOptions).trim()
}
