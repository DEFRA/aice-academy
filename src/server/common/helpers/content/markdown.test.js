import { headingId, renderMarkdown } from './markdown.js'

describe('#renderMarkdown', () => {
  test('Should add GOV.UK classes to headings, paragraphs and lists', () => {
    const html = renderMarkdown('## Title\n\nSome text.\n\n- one\n- two')

    expect(html).toContain('<h2 id="title" class="govuk-heading-m">Title</h2>')
    expect(html).toContain('<p class="govuk-body">Some text.</p>')
    expect(html).toContain('<ul class="govuk-list govuk-list--bullet">')
  })

  test('Should add GOV.UK classes to links and numbered lists', () => {
    const html = renderMarkdown(
      '1. [Toolkit](https://digital.defra.gov.uk/ai-toolkit)'
    )

    expect(html).toContain('<ol class="govuk-list govuk-list--number">')
    expect(html).toContain(
      '<a href="https://digital.defra.gov.uk/ai-toolkit" class="govuk-link">Toolkit</a>'
    )
  })

  test('Should add GOV.UK table classes', () => {
    const html = renderMarkdown('| A | B |\n| --- | --- |\n| 1 | 2 |')

    expect(html).toContain('<table class="govuk-table">')
    expect(html).toContain('<th class="govuk-table__header">A</th>')
    expect(html).toContain('<td class="govuk-table__cell">1</td>')
  })

  test('Should remove scripts and event handlers', () => {
    const html = renderMarkdown(
      'Hello <script>alert(1)</script><img src=x onerror="alert(1)">'
    )

    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('<img')
  })

  test('Should remove unsafe link schemes', () => {
    const html = renderMarkdown('[click](javascript:alert(1))')

    expect(html).not.toContain('javascript:')
  })

  test('Should not let authors set their own classes', () => {
    const html = renderMarkdown('<p class="evil-class">Text</p>')

    expect(html).toContain('<p class="govuk-body">Text</p>')
    expect(html).not.toContain('evil-class')
  })

  test('Should return an empty string for no content', () => {
    expect(renderMarkdown()).toBe('')
  })

  test('Should give level 2 and 3 headings an id to link to', () => {
    expect(renderMarkdown('### Meet your team')).toBe(
      '<h3 id="meet-your-team" class="govuk-heading-s">Meet your team</h3>'
    )
  })

  test('Should open links in a new tab only when the link text says so', () => {
    const html = renderMarkdown(
      '[Sign up (opens in new tab)](https://github.com/signup) and [read more](/glossary)'
    )

    expect(html).toContain(
      '<a href="https://github.com/signup" class="govuk-link" target="_blank" rel="noreferrer noopener">Sign up (opens in new tab)</a>'
    )
    expect(html).toContain(
      '<a href="/glossary" class="govuk-link">read more</a>'
    )
  })

  test('Should not let authors set other link targets', () => {
    const html = renderMarkdown('<a href="/x" target="_top">x</a>')

    expect(html).toBe(
      '<p class="govuk-body"><a href="/x" class="govuk-link">x</a></p>'
    )
  })
})

describe('#headingId', () => {
  test('Should make a readable id from heading text', () => {
    expect(headingId("What you'll do")).toBe('what-you-ll-do')
    expect(headingId('What you&#39;ll do')).toBe('what-you-ll-do')
  })
})
