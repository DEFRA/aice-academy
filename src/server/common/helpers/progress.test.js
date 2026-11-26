import {
  completeMission,
  countCompleted,
  findNextMission,
  getMissionStatus,
  getProgress,
  missionStatus,
  setProfession,
  recordSetupStep,
  startMission
} from './progress.js'

function mockRequest() {
  const store = {}

  return {
    yar: {
      get: (key) => store[key],
      set: (key, value) => {
        store[key] = value
      }
    }
  }
}

describe('#progress', () => {
  let request

  beforeEach(() => {
    request = mockRequest()
  })

  test('Should start with no profession and no missions', () => {
    expect(getProgress(request)).toEqual({ profession: null, missions: {} })
  })

  test('Should save the profession', () => {
    setProfession(request, 'testing')

    expect(getProgress(request).profession).toBe('testing')
  })

  test('Should treat an unseen mission as not started', () => {
    expect(getMissionStatus(getProgress(request), 'gear-up')).toBe(
      missionStatus.notStarted
    )
  })

  test('Should mark a mission as in progress when started', () => {
    startMission(request, 'gear-up')

    expect(getMissionStatus(getProgress(request), 'gear-up')).toBe(
      missionStatus.inProgress
    )
  })

  test('Should complete a mission with a reflection', () => {
    completeMission(request, 'gear-up', 'Never push to main')
    const mission = getProgress(request).missions['gear-up']

    expect(mission.status).toBe(missionStatus.completed)
    expect(mission.reflection).toBe('Never push to main')
    expect(mission.completedAt).toEqual(expect.any(String))
  })

  test('Should not move a completed mission back to in progress', () => {
    completeMission(request, 'gear-up')
    startMission(request, 'gear-up')

    expect(getMissionStatus(getProgress(request), 'gear-up')).toBe(
      missionStatus.completed
    )
  })

  test('Should keep the profession when missions change', () => {
    setProfession(request, 'data')
    completeMission(request, 'gear-up')

    expect(getProgress(request).profession).toBe('data')
  })

  test('Should count completed missions only', () => {
    startMission(request, 'meet-your-team')
    completeMission(request, 'gear-up')

    expect(countCompleted(getProgress(request))).toBe(1)
  })

  test('Should find the first mission that is not completed', () => {
    const missions = [{ slug: 'gear-up' }, { slug: 'meet-your-team' }]
    completeMission(request, 'gear-up')

    expect(findNextMission(missions, getProgress(request))).toEqual({
      slug: 'meet-your-team'
    })
  })

  test('Should find no next mission when all are completed', () => {
    completeMission(request, 'gear-up')

    expect(
      findNextMission([{ slug: 'gear-up' }], getProgress(request))
    ).toBeUndefined()
  })

  test('Should remember the furthest setup step reached', () => {
    setProfession(request, 'data')
    recordSetupStep(request, 3)
    recordSetupStep(request, 2)

    expect(getProgress(request)).toEqual(
      expect.objectContaining({ profession: 'data', setupStep: 3 })
    )
  })
})
