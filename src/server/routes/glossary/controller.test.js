import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import {
  getGlossary,
  getMissions,
  getSetupSteps
} from '#/server/common/helpers/content/content.js'
import { buildGlossaryTerms } from './controller.js'

describe('#buildGlossaryTerms', () => {
  test('Should sort terms alphabetically', () => {
    const terms = buildGlossaryTerms([
      { id: 'b', term: 'Branch' },
      { id: 'a', term: 'Agent' }
    ])

    expect(terms.map((item) => item.term)).toEqual(['Agent', 'Branch'])
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

  test('Should list every term with an id to link to', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/glossary'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('title').text()).toContain('Glossary |')
    expect($('.app-glossary__row')).toHaveLength(getGlossary().length)
    expect($('#terminal .govuk-summary-list__key').text().trim()).toBe(
      'Terminal'
    )
  })

  test('Should have a term for every glossary link in the missions and setup', () => {
    const ids = new Set(getGlossary().map((item) => item.id))
    const html = [...getMissions(), ...getSetupSteps()]
      .map((item) => item.html)
      .join('')
    const linked = [...html.matchAll(/href="\/glossary#([a-z0-9-]+)"/g)].map(
      (match) => match[1]
    )

    expect(linked.length).toBeGreaterThan(5)
    linked.forEach((id) => expect(ids).toContain(id))
  })
})
