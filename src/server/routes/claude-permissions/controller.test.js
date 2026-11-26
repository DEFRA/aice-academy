import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'

describe('#claudePermissionsController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should explain what is safe to allow', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/claude-permissions'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('h1').text().trim()).toBe('When Claude asks permission')
    expect($('#usually-safe-to-allow').text()).toBe('Usually safe to allow')
    expect($('#stop-and-ask-first').text()).toBe('Stop and ask first')
  })
})
