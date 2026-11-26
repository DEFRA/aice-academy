import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import { createSession } from '#/test-helpers/session-helpers.js'
import { professionViewModel } from './controller.js'

describe('#professionViewModel', () => {
  test('Should list every profession and tick the selected one', () => {
    const { profession } = professionViewModel('testing')
    const checked = profession.items.filter((item) => item.checked)
    const options = profession.items.filter((item) => item.value)

    expect(options).toHaveLength(12)
    expect(options.map((item) => item.text)).toEqual(
      expect.arrayContaining(['Something else', "I'm not sure"])
    )
    expect(profession.items.at(-2)).toEqual({ divider: 'or' })
    expect(checked).toEqual([
      expect.objectContaining({ value: 'testing', text: 'Testing' })
    ])
  })

  test('Should add Error to the page title when there are errors', () => {
    const model = professionViewModel(undefined, {
      errorList: [{ text: 'Select one', href: '#profession' }],
      fieldErrors: { profession: { text: 'Select one' } }
    })

    expect(model.pageTitle).toBe('Error: What kind of work do you do?')
    expect(model.profession.errorMessage).toEqual({ text: 'Select one' })
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
    expect($('h1').text().trim()).toBe('What kind of work do you do?')
    expect($('input[name="profession"]')).toHaveLength(12)
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
    expect($('title').text()).toContain('Error: What kind of work do you do?')
    expect($('.govuk-error-summary a').attr('href')).toBe('#profession')
    expect($('.govuk-error-summary').text()).toContain(
      "Select the kind of work you do, or I'm not sure"
    )
    expect($('#profession-error').text()).toContain(
      "Select the kind of work you do, or I'm not sure"
    )
  })

  test('Should reject a profession that does not exist', async () => {
    const response = await createSession(server).post('/profession', {
      profession: 'astronaut'
    })

    expect(response.statusCode).toBe(statusCodes.badRequest)
    expect(response.payload).toContain('Select the kind of work you do')
  })
})
