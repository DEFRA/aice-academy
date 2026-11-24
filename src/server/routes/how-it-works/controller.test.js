import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'

describe('#howItWorksController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected response', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/how-it-works'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('title').text()).toContain('How it works |')
    expect($('[data-testid="app-page-body"] h2').first().text()).toContain(
      "You're the service owner"
    )
    expect($('[data-testid="app-page-body"] .govuk-table')).toHaveLength(1)
  })
})
