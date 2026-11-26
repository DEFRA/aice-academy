import {
  getGlossary,
  getMission,
  getMissions,
  getNextMission,
  getOtherSetupPage,
  getPageHtml,
  getProfession,
  getProfessions,
  getSetupStep,
  getSetupSteps,
  getTeam,
  parseFrontMatter
} from './content.js'

describe('#content', () => {
  describe('Missions', () => {
    test('Should load all ten missions in order, numbered from 1', () => {
      expect(getMissions().map((mission) => mission.number)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      ])
    })

    test('Should give every mission a unique slug', () => {
      const slugs = getMissions().map((mission) => mission.slug)

      expect(new Set(slugs).size).toBe(slugs.length)
    })

    test('Should put every mission in one of the four stages', () => {
      expect([
        ...new Set(getMissions().map((mission) => mission.stage))
      ]).toEqual(['Get set up', 'Plan', 'Build', 'Finish'])
    })

    test('Should only use known profession ids in lead lists', () => {
      const ids = getProfessions().map((profession) => profession.id)

      getMissions().forEach((mission) => {
        mission.lead.forEach((id) => expect(ids).toContain(id))
      })
    })

    test('Should start every mission body with what you will do', () => {
      getMissions().forEach((mission) =>
        expect(mission.html).toMatch(/^<h2 id="what-you-ll-do"/)
      )
    })

    test('Should render help with links as safe HTML', () => {
      const [help] = getMission('gear-up').stuck

      expect(help.fixHtml).toContain('<a href="/setup" class="govuk-link">')
    })

    test("Should give every mission an I'm stuck list", () => {
      getMissions().forEach((mission) =>
        expect(mission.stuck.length).toBeGreaterThan(0)
      )
    })

    test('Should only mark Mission 1 as the setup mission', () => {
      expect(
        getMissions()
          .filter((mission) => mission.setup)
          .map((mission) => mission.slug)
      ).toEqual(['gear-up'])
    })

    test('Should return undefined for an unknown mission', () => {
      expect(getMission('not-a-mission')).toBeUndefined()
    })

    test('Should find the next mission', () => {
      expect(getNextMission('gear-up').slug).toBe('meet-your-team')
    })

    test('Should have no next mission after the last one', () => {
      expect(getNextMission('ship-and-show')).toBeUndefined()
    })

    test('Should have no next mission for an unknown mission', () => {
      expect(getNextMission('not-a-mission')).toBeUndefined()
    })
  })

  describe('Setup steps', () => {
    test('Should load six steps in order, each with help', () => {
      const steps = getSetupSteps()

      expect(steps.map((step) => step.number)).toEqual([1, 2, 3, 4, 5, 6])
      steps.forEach((step) => {
        expect(step.see).toEqual(expect.any(String))
        expect(step.stuck.length).toBeGreaterThan(0)
      })
    })

    test('Should find a step by its slug', () => {
      expect(getSetupStep('open-claude').title).toBe('Open Claude')
    })

    test('Should load the technical setup pages', () => {
      expect(getOtherSetupPage('terminal').html).toContain(
        'git clone https://github.com/DEFRA/aice-academy-practice.git'
      )
      expect(getOtherSetupPage('desktop-app').title).toBe(
        'Set up in the Claude desktop app'
      )
    })

    test('Should return undefined for an unknown technical page', () => {
      expect(getOtherSetupPage('nope')).toBeUndefined()
    })
  })

  describe('Professions, team and glossary', () => {
    test('Should offer every profession plus Something else and Not sure', () => {
      const professions = getProfessions()

      expect(professions).toHaveLength(12)
      expect(professions.map((profession) => profession.id)).toEqual(
        expect.arrayContaining(['something-else', 'not-sure'])
      )
      professions.forEach((profession) => {
        expect(profession.hint).toEqual(expect.any(String))
        expect(profession.stretch).toEqual(expect.any(String))
      })
    })

    test('Should find a profession by id', () => {
      expect(getProfession('content-design').name).toBe('Content design')
    })

    test('Should give the seven teammates friendly names', () => {
      expect(getTeam().map((member) => member.name)).toEqual([
        'Product coach',
        'Interaction designer',
        'Content designer',
        'Developer',
        'Tester',
        'Accessibility checker',
        'Reviewer'
      ])
    })

    test('Should give every glossary term a unique id', () => {
      const ids = getGlossary().map((item) => item.id)

      expect(ids.length).toBeGreaterThanOrEqual(30)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('Pages', () => {
    test('Should render a content page with linkable headings', () => {
      const html = getPageHtml('how-it-works')

      expect(html).toContain('<table class="govuk-table">')
      expect(html).toContain('id="meet-your-team"')
    })
  })

  describe('#parseFrontMatter', () => {
    test('Should split front matter and body', () => {
      expect(parseFrontMatter('---\ntitle: Hi\n---\nBody', 'x.md')).toEqual({
        data: { title: 'Hi' },
        body: 'Body'
      })
    })

    test('Should throw when there is no front matter', () => {
      expect(() => parseFrontMatter('No front matter', 'x.md')).toThrow(
        'x.md has no front matter'
      )
    })
  })
})
