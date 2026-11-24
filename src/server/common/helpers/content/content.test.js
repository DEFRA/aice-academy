import {
  getGlossary,
  getMission,
  getMissions,
  getNextMission,
  getPageHtml,
  getProfession,
  getProfessions,
  getTeam,
  parseFrontMatter
} from './content.js'

describe('#content', () => {
  describe('Missions', () => {
    test('Should load all ten missions in order', () => {
      const missions = getMissions()

      expect(missions).toHaveLength(10)
      expect(missions.map((mission) => mission.number)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
      ])
    })

    test('Should give every mission a unique slug', () => {
      const slugs = getMissions().map((mission) => mission.slug)

      expect(new Set(slugs).size).toBe(slugs.length)
    })

    test('Should only use known profession ids in lead lists', () => {
      const ids = getProfessions().map((profession) => profession.id)

      getMissions().forEach((mission) => {
        mission.lead.forEach((id) => expect(ids).toContain(id))
      })
    })

    test('Should render mission body as GOV.UK HTML', () => {
      const mission = getMission('first-page-test-first')
      expect(getMission('gear-up').html).toContain(
        'git clone --depth 1 https://github.com/DEFRA/cdp-node-frontend-template.git'
      )

      expect(mission.title).toBe('First page, test first')
      expect(mission.html).toContain('<h2 class="govuk-heading-m">')
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

  describe('Professions and glossary', () => {
    test('Should load ten professions with a stretch challenge each', () => {
      const professions = getProfessions()

      expect(professions).toHaveLength(10)
      professions.forEach((profession) =>
        expect(profession.stretch).toEqual(expect.any(String))
      )
    })

    test('Should find a profession by id', () => {
      expect(getProfession('content-design').name).toBe('Content design')
    })

    test('Should load the seven-agent team', () => {
      expect(getTeam().map((member) => member.name)).toEqual([
        'product-coach',
        'interaction-designer',
        'content-designer',
        'developer',
        'tester',
        'accessibility-auditor',
        'reviewer'
      ])
    })

    test('Should load the glossary', () => {
      expect(getGlossary()).toEqual(
        expect.arrayContaining([expect.objectContaining({ term: 'Hook' })])
      )
    })
  })

  describe('Pages', () => {
    test('Should render a content page', () => {
      expect(getPageHtml('how-it-works')).toContain(
        '<table class="govuk-table">'
      )
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
