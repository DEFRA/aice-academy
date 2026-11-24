import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import { createSession } from '#/test-helpers/session-helpers.js'
import { professionViewModel } from './controller.js'

describe('#professionViewModel', () => {
  test('Should list every profession and tick the selected one', () => {
    const { profession } = professionViewModel('testing')
    const checked = profession.items.filter((item) => item.checked)

    expect(profession.items).toHaveLength(10)
    expect(checked).toEqual([
      expect.objectContaining({ value: 'testing', text: 'Testing' })
    ])
  })

  test('Should add Error to the page title when there are errors', () => {
    const model = professionViewModel(undefined, {
      errorList: [{ text: 'Select your profession', href: '#profession' }],
      fieldErrors: { profession: { text: 'Select your profession' } }
    })

    expect(model.pageTitle).toBe("Error: What's your profession?")
    expect(model.profession.errorMessage).toEqual({
      text: 'Select your profession'
    })
  })
})

describe('#professionController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should ask the question as the page heading', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/profession'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('h1').text().trim()).toBe("What's your profession?")
    expect($('input[name="profession"]')).toHaveLength(10)
  })

  test('Should save the profession and go to the missions', async () => {
    const session = createSession(server)
    const response = await session.post('/profession', {
      profession: 'content-design'
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/missions')

    const $ = load((await session.get('/profession')).payload)
    expect($('input[value="content-design"]').attr('checked')).toBeDefined()
  })

  test('Should show an error when nothing is selected', async () => {
    const response = await createSession(server).post('/profession', {})
    const $ = load(response.payload)

    expect(response.statusCode).toBe(statusCodes.badRequest)
    expect($('title').text()).toContain("Error: What's your profession?")
    expect($('.govuk-error-summary a').attr('href')).toBe('#profession')
    expect($('.govuk-error-summary').text()).toContain('Select your profession')
    expect($('#profession-error').text()).toContain('Select your profession')
  })

  test('Should reject a profession that does not exist', async () => {
    const response = await createSession(server).post('/profession', {
      profession: 'astronaut'
    })

    expect(response.statusCode).toBe(statusCodes.badRequest)
    expect(response.payload).toContain('Select your profession')
  })
})
