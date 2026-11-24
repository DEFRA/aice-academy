import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import { getMissions } from '#/server/common/helpers/content/content.js'
import { missionStatus } from '#/server/common/helpers/progress.js'
import { createSession } from '#/test-helpers/session-helpers.js'
import { buildCallToAction } from './controller.js'

const allCompleted = () =>
  Object.fromEntries(
    getMissions().map((mission) => [
      mission.slug,
      { status: missionStatus.completed }
    ])
  )

describe('#buildCallToAction', () => {
  test('Should start a new learner by choosing a profession', () => {
    expect(
      buildCallToAction(getMissions(), { profession: null, missions: {} })
    ).toEqual({ text: 'Start now', href: '/profession' })
  })

  test('Should take a learner to their next unfinished mission', () => {
    expect(
      buildCallToAction(getMissions(), {
        profession: 'testing',
        missions: {
          'gear-up': { status: missionStatus.completed },
          'meet-your-team': { status: missionStatus.inProgress }
        }
      })
    ).toEqual({
      text: 'Continue to Mission 1',
      href: '/missions/meet-your-team'
    })
  })

  test('Should ask a learner with progress but no profession to choose one', () => {
    expect(
      buildCallToAction(getMissions(), {
        profession: null,
        missions: { 'gear-up': { status: missionStatus.completed } }
      })
    ).toEqual({ text: 'Continue', href: '/profession' })
  })

  test('Should show a graduate their badges', () => {
    expect(
      buildCallToAction(getMissions(), {
        profession: 'data',
        missions: allCompleted()
      })
    ).toEqual({ text: 'See your badges', href: '/missions' })
  })
})

describe('#homeController', () => {
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
      url: '/'
    })

    expect(result).toEqual(
      expect.stringContaining(
        'Build a real government service with an AI team |'
      )
    )
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should sell the academy to a new learner', async () => {
    const $ = load((await server.inject({ method: 'GET', url: '/' })).result)

    expect($('h1').text().trim()).toBe(
      'Build a real government service with an AI team'
    )
    expect($('[data-testid="app-team"] li')).toHaveLength(7)
    expect($('[data-testid="app-professions"] li')).toHaveLength(10)
    expect($('.app-stat__number').first().text()).toBe('10')
    expect($('.govuk-button--start').first().attr('href')).toBe('/profession')
    expect($('.govuk-button--start').first().text().trim()).toBe('Start now')
  })

  test('Should welcome back a returning learner', async () => {
    const session = createSession(server)
    await session.post('/profession', { profession: 'testing' })
    await session.post('/missions/gear-up', {
      checks: getMissions()[0].checks.map((_, index) => String(index))
    })

    const $ = load((await session.get('/')).payload)

    expect($('[data-testid="app-welcome-back"]').text()).toContain(
      "You've completed 1 of 10 missions."
    )
    expect($('.govuk-button--start').first().attr('href')).toBe(
      '/missions/meet-your-team'
    )
    expect($('[data-testid="app-cta"] h2').text()).toBe(
      'Pick up where you left off'
    )
  })
})
