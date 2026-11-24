import Boom from '@hapi/boom'
import Joi from 'joi'

import { statusCodes } from '#/server/common/constants/status-codes.js'
import {
  getMission,
  getMissions,
  getNextMission,
  getProfession
} from '#/server/common/helpers/content/content.js'
import { buildFormErrors } from '#/server/common/helpers/form-errors.js'
import {
  completeMission,
  countCompleted,
  getMissionStatus,
  getProgress,
  missionStatus,
  startMission
} from '#/server/common/helpers/progress.js'

const checksError = 'Tick every check to show the mission worked'
const reflectionMaxLength = 1000

const statusLabels = {
  [missionStatus.notStarted]: {
    tag: { text: 'Not yet started', classes: 'govuk-tag--blue' }
  },
  [missionStatus.inProgress]: {
    tag: { text: 'In progress', classes: 'govuk-tag--light-blue' }
  },
  [missionStatus.completed]: { text: 'Completed' }
}

function missionBreadcrumbs(mission) {
  return [
    { text: 'Home', href: '/' },
    { text: 'Missions', href: '/missions' },
    { text: `Mission ${mission.number}` }
  ]
}

function findMissionOrThrow(slug) {
  const mission = getMission(slug)

  if (!mission) {
    throw Boom.notFound()
  }

  return mission
}

/**
 * Task list items for every mission, with the learner's status and track.
 */
export function buildTaskListItems(missions, progress) {
  return missions.map((mission) => {
    const leads = mission.lead.includes(progress.profession)

    return {
      title: { text: `Mission ${mission.number}: ${mission.title}` },
      href: `/missions/${mission.slug}`,
      hint: {
        text: `Badge: ${mission.badge}${leads ? '. You lead this mission' : ''}`
      },
      status: statusLabels[getMissionStatus(progress, mission.slug)]
    }
  })
}

export function missionViewModel(mission, progress, form = {}) {
  const { ticked = [], reflection, errors = {} } = form
  const saved = progress.missions[mission.slug] ?? {}
  const isCompleted = saved.status === missionStatus.completed
  const profession = getProfession(progress.profession)
  const hasErrors = Boolean(errors.errorList?.length)
  const tickedChecks =
    isCompleted && !form.ticked
      ? mission.checks.map((_, i) => String(i))
      : ticked

  return {
    pageTitle: `${hasErrors ? 'Error: ' : ''}Mission ${mission.number}: ${mission.title}`,
    heading: mission.title,
    caption: `Mission ${mission.number}`,
    breadcrumbs: missionBreadcrumbs(mission),
    mission,
    isCompleted,
    errorList: errors.errorList,
    leadTrack:
      profession && mission.lead.includes(profession.id) ? profession : null,
    summaryRows: [
      { key: { text: "You'll build" }, value: { text: mission.build } },
      { key: { text: "You'll learn" }, value: { text: mission.learn } },
      { key: { text: 'Your team' }, value: { text: mission.team } },
      { key: { text: 'Time' }, value: { text: mission.time } },
      { key: { text: 'Badge' }, value: { text: mission.badge } }
    ],
    checks: {
      idPrefix: 'checks',
      name: 'checks',
      fieldset: {
        legend: {
          text: "You'll know it worked when",
          classes: 'govuk-fieldset__legend--m'
        }
      },
      hint: { text: 'Tick each one when it is true.' },
      errorMessage: errors.fieldErrors?.checks,
      items: mission.checks.map((text, index) => ({
        value: String(index),
        text,
        checked: tickedChecks.includes(String(index))
      }))
    },
    reflection: {
      id: 'reflection',
      name: 'reflection',
      maxlength: reflectionMaxLength,
      label: {
        text: `Team huddle: ${mission.huddle}`,
        classes: 'govuk-label--m'
      },
      hint: { text: 'Optional. Write a few words to bring to your cohort.' },
      value: reflection ?? saved.reflection,
      errorMessage: errors.fieldErrors?.reflection
    }
  }
}

export const missionsController = {
  handler(request, h) {
    const missions = getMissions()
    const progress = getProgress(request)
    const completedCount = countCompleted(progress)

    return h.view('missions/index', {
      pageTitle: 'Your missions',
      heading: 'Your missions',
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Missions' }],
      missionCount: missions.length,
      completedCount,
      hasGraduated: completedCount === missions.length,
      profession: getProfession(progress.profession),
      badges: missions
        .filter(
          (mission) =>
            getMissionStatus(progress, mission.slug) === missionStatus.completed
        )
        .map((mission) => mission.badge),
      taskListItems: buildTaskListItems(missions, progress)
    })
  }
}

export const missionController = {
  handler(request, h) {
    const mission = findMissionOrThrow(request.params.slug)
    startMission(request, mission.slug)

    return h.view(
      'missions/mission',
      missionViewModel(mission, getProgress(request))
    )
  }
}

export const completeMissionController = {
  options: {
    validate: {
      payload: Joi.object({
        checks: Joi.array().items(Joi.string()).single().default([]),
        reflection: Joi.string()
          .allow('')
          .trim()
          .max(reflectionMaxLength)
          .default('')
          .messages({
            'string.max': `Your huddle answer must be ${reflectionMaxLength.toLocaleString('en-GB')} characters or fewer`
          })
      }),
      failAction(request, h, error) {
        const mission = findMissionOrThrow(request.params.slug)

        return h
          .view(
            'missions/mission',
            missionViewModel(mission, getProgress(request), {
              ticked: [request.payload?.checks ?? []].flat(),
              reflection: request.payload?.reflection,
              errors: buildFormErrors(error.details)
            })
          )
          .code(statusCodes.badRequest)
          .takeover()
      }
    }
  },
  handler(request, h) {
    const mission = findMissionOrThrow(request.params.slug)
    const { checks, reflection } = request.payload
    const allTicked = mission.checks.every((_, index) =>
      checks.includes(String(index))
    )

    if (!allTicked) {
      return h
        .view(
          'missions/mission',
          missionViewModel(mission, getProgress(request), {
            ticked: checks,
            reflection,
            errors: buildFormErrors([
              { path: ['checks'], message: checksError }
            ])
          })
        )
        .code(statusCodes.badRequest)
    }

    completeMission(request, mission.slug, reflection)

    return h.redirect(`/missions/${mission.slug}/complete`)
  }
}

export const missionCompleteController = {
  handler(request, h) {
    const mission = findMissionOrThrow(request.params.slug)
    const progress = getProgress(request)

    if (getMissionStatus(progress, mission.slug) !== missionStatus.completed) {
      return h.redirect(`/missions/${mission.slug}`)
    }

    const missionCount = getMissions().length
    const completedCount = countCompleted(progress)

    return h.view('missions/complete', {
      pageTitle: `Mission ${mission.number} complete`,
      mission,
      nextMission: getNextMission(mission.slug),
      completedCount,
      missionCount,
      hasGraduated: completedCount === missionCount
    })
  }
}
