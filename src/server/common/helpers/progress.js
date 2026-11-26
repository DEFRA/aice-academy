const sessionKey = 'academyProgress'

export const missionStatus = {
  notStarted: 'not-started',
  inProgress: 'in-progress',
  completed: 'completed'
}

/**
 * The learner's progress through the academy, held in the session.
 * @param {import('@hapi/hapi').Request} request
 */
export function getProgress(request) {
  return request.yar.get(sessionKey) ?? { profession: null, missions: {} }
}

function saveProgress(request, progress) {
  request.yar.set(sessionKey, progress)
}

export function setProfession(request, professionId) {
  saveProgress(request, { ...getProgress(request), profession: professionId })
}

/**
 * Remembers the furthest setup step the learner has reached.
 */
export function recordSetupStep(request, stepNumber) {
  const progress = getProgress(request)

  if ((progress.setupStep ?? 0) >= stepNumber) {
    return
  }

  saveProgress(request, { ...progress, setupStep: stepNumber })
}

export function getMissionStatus(progress, slug) {
  return progress.missions[slug]?.status ?? missionStatus.notStarted
}

/**
 * Marks a mission as in progress the first time the learner opens it.
 */
export function startMission(request, slug) {
  const progress = getProgress(request)

  if (getMissionStatus(progress, slug) !== missionStatus.notStarted) {
    return
  }

  saveProgress(request, {
    ...progress,
    missions: {
      ...progress.missions,
      [slug]: { status: missionStatus.inProgress }
    }
  })
}

export function completeMission(request, slug, reflection = '') {
  const progress = getProgress(request)

  saveProgress(request, {
    ...progress,
    missions: {
      ...progress.missions,
      [slug]: {
        status: missionStatus.completed,
        reflection,
        completedAt: new Date().toISOString()
      }
    }
  })
}

export function countCompleted(progress) {
  return Object.values(progress.missions).filter(
    (mission) => mission.status === missionStatus.completed
  ).length
}

/**
 * The first mission the learner hasn't completed, or undefined when all are done.
 */
export function findNextMission(missions, progress) {
  return missions.find(
    (mission) =>
      getMissionStatus(progress, mission.slug) !== missionStatus.completed
  )
}
