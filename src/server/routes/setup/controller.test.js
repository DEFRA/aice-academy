import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import { getSetupSteps } from '#/server/common/helpers/content/content.js'
import { createSession } from '#/test-helpers/session-helpers.js'
import { setupOverviewModel, setupStepModel } from './controller.js'

describe('#setupOverviewModel', () => {
  test('Should start a new learner at step 1', () => {
    expect(setupOverviewModel().callToAction).toEqual({
      text: 'Start setup',
      href: '/setup/github-account'
    })
  })

  test('Should continue from the next step', () => {
    const model = setupOverviewModel(2)

    expect(model.callToAction).toEqual({
      text: 'Continue: step 3',
      href: '/setup/wait-for-setup'
    })
    expect(model.steps.filter((step) => step.isDone)).toHaveLength(2)
  })

  test('Should send a learner who finished to tick off the mission', () => {
    expect(setupOverviewModel(6).callToAction.href).toBe('/setup/done')
  })
})

describe('#setupStepModel', () => {
  const steps = getSetupSteps()

  test('Should link each step to the next', () => {
    const model = setupStepModel(steps[0])

    expect(model.caption).toBe('Get set up: step 1 of 6')
    expect(model.nextHref).toBe('/setup/open-workspace')
    expect(model.nextText).toBe('Done, go to step 2')
    expect(model.previousHref).toBe('/setup')
  })

  test('Should finish after the last step', () => {
    const model = setupStepModel(steps.at(-1))

    expect(model.nextHref).toBe('/setup/done')
    expect(model.nextText).toBe("Done, I'm set up")
    expect(model.progressPercent).toBe(100)
  })
})

describe('#setupControllers', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should list the six steps on the overview', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/setup'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('h1').text().trim()).toBe('Get set up')
    expect($('[data-testid="app-setup-steps"] li')).toHaveLength(6)
    expect($('.govuk-button--start').attr('href')).toBe('/setup/github-account')
  })

  test('Should tuck technical routes away', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/setup' })).result
    )

    expect($('.govuk-details__summary-text').text()).toContain(
      'Other ways to set up, for people who use technical tools'
    )
  })

  test('Should show one step with what you will see and help', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/setup/start-your-service'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('h1').text().trim()).toBe('Start your service')
    expect($('[data-testid="app-progress"]').text()).toContain('step 4 of 6')
    expect($('[data-testid="app-step-body"] pre').text()).toContain(
      'npm run dev'
    )
    expect($('[data-testid="app-step-see"]').text()).toContain('Your service')
    expect(
      $('[data-testid="app-stuck"] .govuk-details__summary-text').text().trim()
    ).toBe("This isn't what I see")
    expect($('a.govuk-button').attr('href')).toBe('/setup/open-claude')
  })

  test('Should open external links in a new tab and say so', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/setup/open-workspace' }))
        .result
    )
    const link = $(
      'a[href="https://codespaces.new/DEFRA/aice-academy-practice"]'
    )

    expect(link.attr('target')).toBe('_blank')
    expect(link.text()).toContain('(opens in new tab)')
  })

  test('Should remember progress through the steps', async () => {
    const session = createSession(server)
    await session.get('/setup/open-claude')

    const $ = load((await session.get('/setup')).payload)
    expect($('.govuk-button--start').text().trim()).toBe('Continue: step 5')
  })

  test('Should celebrate when setup is done', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/setup/done' })).result
    )

    expect($('.govuk-panel__title').text().trim()).toBe("You're set up")
    expect($('a.govuk-button').attr('href')).toBe('/missions/gear-up#checks')
  })

  test('Should show the technical setup pages', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/setup/other/terminal' }))
        .result
    )

    expect($('h1').text().trim()).toBe('Set up in a terminal')
  })

  test('Should return page not found for unknown steps and pages', async () => {
    const step = await server.inject({ method: 'GET', url: '/setup/nope' })
    const other = await server.inject({
      method: 'GET',
      url: '/setup/other/nope'
    })

    expect(step.statusCode).toBe(statusCodes.notFound)
    expect(other.statusCode).toBe(statusCodes.notFound)
  })
})
