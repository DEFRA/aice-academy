import { load } from 'cheerio'
import { createServer } from '#/server/server.js'
import { statusCodes } from '#/server/common/constants/status-codes.js'
import {
  getMission,
  getMissions
} from '#/server/common/helpers/content/content.js'
import { missionStatus } from '#/server/common/helpers/progress.js'
import { createSession } from '#/test-helpers/session-helpers.js'
import { buildTaskListItems, missionViewModel } from './controller.js'

const allChecksFor = (slug) =>
  getMission(slug).checks.map((_, index) => String(index))

describe('#buildTaskListItems', () => {
  test('Should show each mission status the GOV.UK task list way', () => {
    const items = buildTaskListItems(getMissions().slice(0, 3), {
      profession: null,
      missions: {
        'gear-up': { status: missionStatus.completed },
        'meet-your-team': { status: missionStatus.inProgress }
      }
    })

    expect(items[0].status).toEqual({ text: 'Completed' })
    expect(items[1].status.tag.text).toBe('In progress')
    expect(items[2].status.tag.text).toBe('Not yet started')
    expect(items[0].href).toBe('/missions/gear-up')
  })

  test('Should flag the missions the learner leads', () => {
    const items = buildTaskListItems(getMissions(), {
      profession: 'testing',
      missions: {}
    })
    const led = items.filter((item) => item.hint.text.includes('You lead'))

    expect(led.map((item) => item.title.text)).toEqual([
      'Mission 5: Build your first pages',
      'Mission 7: Check and confirm'
    ])
  })
})

describe('#missionViewModel', () => {
  test('Should show the stretch challenge to a learner who leads the mission', () => {
    const model = missionViewModel(getMission('quality-gate'), {
      profession: 'content-design',
      missions: {}
    })

    expect(model.leadTrack.name).toBe('Content design')
  })

  test('Should not show a stretch challenge to other professions', () => {
    const model = missionViewModel(getMission('quality-gate'), {
      profession: 'data',
      missions: {}
    })

    expect(model.leadTrack).toBeNull()
  })

  test('Should tick every check once a mission is complete', () => {
    const model = missionViewModel(getMission('gear-up'), {
      profession: null,
      missions: {
        'gear-up': { status: missionStatus.completed, reflection: 'Ask first' }
      }
    })

    expect(model.checks.items.every((item) => item.checked)).toBe(true)
    expect(model.reflection.value).toBe('Ask first')
  })
})

describe('#missionsController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should list all ten missions in a task list', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/missions'
    })
    const $ = load(result)

    expect(statusCode).toBe(statusCodes.ok)
    expect($('title').text()).toContain('Your missions |')
    expect($('.govuk-task-list__item')).toHaveLength(10)
    expect($('[data-testid="app-progress"]').text()).toContain(
      'You have completed 0 of 10 missions.'
    )
  })

  test('Should point a new learner to Mission 1', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/missions' })).result
    )

    expect($('[data-testid="app-next"]').text()).toContain('Start here')
    expect($('[data-testid="app-next"] a.govuk-button').attr('href')).toBe(
      '/missions/gear-up'
    )
  })

  test('Should group missions into four stages', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/missions' })).result
    )

    expect(
      $('.app-stage-heading')
        .map((_, heading) => $(heading).text().trim())
        .get()
    ).toEqual([
      'Stage 1: Get set up',
      'Stage 2: Plan',
      'Stage 3: Build',
      'Stage 4: Finish'
    ])
  })

  test('Should show what you will do, then steps, then checks', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/missions/first-page-test-first'
    })
    const $ = load(response.result)
    const body = $('[data-testid="app-mission-body"]')

    expect(response.statusCode).toBe(statusCodes.ok)
    expect($('h1').text().trim()).toBe('Build your first pages')
    expect($('.govuk-caption-l').text()).toBe('Mission 5 of 10: Build')
    expect(body.find('h2').first().text()).toBe("What you'll do")
    expect(body.find('pre').first().text().trim()).toBe(
      '/golden-loop Start page'
    )
    expect($('input[name="checks"]')).toHaveLength(5)
    expect($('legend').text()).toContain('Check it worked')
  })

  test('Should link to the previous and next missions', async () => {
    const $ = load(
      (
        await server.inject({
          method: 'GET',
          url: '/missions/first-page-test-first'
        })
      ).result
    )

    expect($('.govuk-pagination__prev a').attr('href')).toBe(
      '/missions/design-the-journey'
    )
    expect($('.govuk-pagination__next a').attr('href')).toBe(
      '/missions/build-the-journey'
    )
  })

  test("Should show mission-specific help in an I'm stuck panel", async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/missions/ship-and-show' }))
        .result
    )
    const stuck = $('[data-testid="app-stuck"]')

    expect(stuck.find('.govuk-details__summary-text').text().trim()).toBe(
      "I'm stuck"
    )
    expect(stuck.find('.app-stuck__problem')).toHaveLength(3)
    expect(stuck.text()).toContain('Still stuck?')
  })

  test('Should send Mission 1 learners to the setup steps', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/missions/gear-up' })).result
    )
    const button = $('[data-testid="app-setup"] a.govuk-button')

    expect(button.attr('href')).toBe('/setup')
    expect(button.text().trim()).toBe('Start setup')
  })

  test('Should not show setup on other missions', async () => {
    const $ = load(
      (await server.inject({ method: 'GET', url: '/missions/quality-gate' }))
        .result
    )

    expect($('[data-testid="app-setup"]')).toHaveLength(0)
  })

  test('Should return page not found for an unknown mission', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/missions/not-a-mission'
    })

    expect(response.statusCode).toBe(statusCodes.notFound)
    expect(response.result).toContain('Page not found')
  })

  test('Should mark a mission in progress when the learner opens it', async () => {
    const session = createSession(server)
    await session.get('/missions/gear-up')

    const $ = load((await session.get('/missions')).payload)
    expect($('#missions-get-set-up-1-status').text().trim()).toBe('In progress')
  })

  test('Should show an error if not every check is ticked', async () => {
    const response = await createSession(server).post('/missions/gear-up', {
      checks: '0'
    })
    const $ = load(response.payload)

    expect(response.statusCode).toBe(statusCodes.badRequest)
    expect($('title').text()).toContain('Error: Mission 1: Get set up')
    expect($('.govuk-error-summary a').attr('href')).toBe('#checks')
    expect($('#checks-error').text()).toContain(
      'Tick every check to show the mission worked'
    )
    expect($('input[name="checks"][value="0"]').attr('checked')).toBeDefined()
  })

  test('Should show an error if the huddle answer is too long', async () => {
    const response = await createSession(server).post('/missions/gear-up', {
      checks: allChecksFor('gear-up'),
      reflection: 'a'.repeat(1001)
    })
    const $ = load(response.payload)

    expect(response.statusCode).toBe(statusCodes.badRequest)
    expect($('#reflection-error').text()).toContain(
      'Your huddle answer must be 1,000 characters or fewer'
    )
  })

  test('Should complete a mission and award the badge', async () => {
    const session = createSession(server)
    const response = await session.post('/missions/gear-up', {
      checks: allChecksFor('gear-up'),
      reflection: 'Never push without asking'
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/missions/gear-up/complete')

    const $ = load((await session.get('/missions/gear-up/complete')).payload)
    expect($('.govuk-panel__title').text().trim()).toBe('Mission 1 complete')
    expect($('.govuk-panel__body').text()).toContain('Kitted out')
    expect($('a.govuk-button').attr('href')).toBe('/missions/meet-your-team')

    const missions$ = load((await session.get('/missions')).payload)
    expect(missions$('#missions-get-set-up-1-status').text().trim()).toBe(
      'Completed'
    )
    expect(missions$('[data-testid="app-badges"]').text()).toContain(
      'Kitted out'
    )
  })

  test('Should send learners back to a mission they have not completed', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/missions/gear-up/complete'
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/missions/gear-up')
  })

  test('Should graduate the learner after the last mission', async () => {
    const session = createSession(server)

    for (const mission of getMissions()) {
      await session.post(`/missions/${mission.slug}`, {
        checks: allChecksFor(mission.slug)
      })
    }

    const $ = load((await session.get('/missions')).payload)
    expect($('.govuk-panel__title').text().trim()).toBe("You've graduated")
    expect($('[data-testid="app-progress"]').text()).toContain('10 of 10')
  })
})
