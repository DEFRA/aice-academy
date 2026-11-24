import {
  getMissions,
  getProfessions,
  getTeam
} from '#/server/common/helpers/content/content.js'
import {
  countCompleted,
  findNextMission,
  getProgress
} from '#/server/common/helpers/progress.js'

/**
 * Where the main call to action takes the learner, and what it says.
 */
export function buildCallToAction(missions, progress) {
  const completedCount = countCompleted(progress)
  const hasStarted = Boolean(progress.profession) || completedCount > 0

  if (!hasStarted) {
    return { text: 'Start now', href: '/profession' }
  }

  if (!progress.profession) {
    return { text: 'Continue', href: '/profession' }
  }

  const nextMission = findNextMission(missions, progress)

  if (!nextMission) {
    return { text: 'See your badges', href: '/missions' }
  }

  return {
    text: `Continue to Mission ${nextMission.number}`,
    href: `/missions/${nextMission.slug}`
  }
}

/**
 * The AICE Academy home page.
 */
export const homeController = {
  handler(request, h) {
    const missions = getMissions()
    const progress = getProgress(request)
    const completedCount = countCompleted(progress)

    return h.view('home/index', {
      pageTitle: 'Build a real government service with an AI team',
      heading: 'Build a real government service with an AI team',
      missionCount: missions.length,
      completedCount,
      isReturning: Boolean(progress.profession) || completedCount > 0,
      callToAction: buildCallToAction(missions, progress),
      team: getTeam(),
      professions: getProfessions()
    })
  }
}
