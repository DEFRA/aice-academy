import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import { buildGlossaryRows } from './controller.js'

describe('#buildGlossaryRows', () => {
  test('Should escape glossary content', () => {
    const [row] = buildGlossaryRows([
      { term: 'Hook', meaning: '<script>x</script>', comparison: 'A & B' }
    ])

    expect(row.value.html).not.toContain('<script>')
    expect(row.value.html).toContain('&lt;script&gt;')
    expect(row.value.html).toContain('A &amp; B')
  })
})

describe('#glossaryController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should list every glossary term', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/glossary'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('title').text()).toContain('Glossary |')
    expect($('.govuk-summary-list__row')).toHaveLength(10)
    expect($('.govuk-summary-list__key').first().text().trim()).toBe(
      'Claude Code'
    )
  })
})
