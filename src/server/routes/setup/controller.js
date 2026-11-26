import Boom from '@hapi/boom'

import {
  getOtherSetupPage,
  getSetupStep,
  getSetupSteps
} from '#/server/common/helpers/content/content.js'
import {
  getProgress,
  recordSetupStep
} from '#/server/common/helpers/progress.js'

const setupBreadcrumbs = [
  { text: 'Home', href: '/' },
  { text: 'Missions', href: '/missions' },
  { text: 'Get set up', href: '/setup' }
]

/**
 * Overview of the step-by-step setup, with where the learner got to.
 */
export function setupOverviewModel(setupStep = 0) {
  const steps = getSetupSteps()
  const nextStep = steps.find((step) => step.number > setupStep)
  const isFinished = setupStep >= steps.length

  return {
    pageTitle: 'Get set up',
    heading: 'Get set up',
    breadcrumbs: setupBreadcrumbs.slice(0, 2).concat({ text: 'Get set up' }),
    stepCount: steps.length,
    steps: steps.map((step) => ({
      ...step,
      isDone: step.number <= setupStep
    })),
    callToAction: isFinished
      ? { text: "You're set up: tick off Mission 1", href: '/setup/done' }
      : {
          text:
            setupStep > 0 ? `Continue: step ${nextStep.number}` : 'Start setup',
          href: `/setup/${nextStep.slug}`
        }
  }
}

export function setupStepModel(step, steps = getSetupSteps()) {
  const next = steps.find(({ number }) => number === step.number + 1)
  const previous = steps.find(({ number }) => number === step.number - 1)

  return {
    pageTitle: `Step ${step.number}: ${step.title}`,
    heading: step.title,
    caption: `Get set up: step ${step.number} of ${steps.length}`,
    breadcrumbs: setupBreadcrumbs,
    step,
    progressPercent: Math.round((step.number / steps.length) * 100),
    nextHref: next ? `/setup/${next.slug}` : '/setup/done',
    nextText: next ? `Done, go to step ${next.number}` : "Done, I'm set up",
    previousHref: previous ? `/setup/${previous.slug}` : '/setup'
  }
}

export const setupOverviewController = {
  handler(request, h) {
    return h.view(
      'setup/index',
      setupOverviewModel(getProgress(request).setupStep)
    )
  }
}

export const setupStepController = {
  handler(request, h) {
    const step = getSetupStep(request.params.slug)

    if (!step) {
      throw Boom.notFound()
    }

    recordSetupStep(request, step.number - 1)

    return h.view('setup/step', setupStepModel(step))
  }
}

export const setupDoneController = {
  handler(request, h) {
    recordSetupStep(request, getSetupSteps().length)

    return h.view('setup/done', {
      pageTitle: "You're set up",
      breadcrumbs: setupBreadcrumbs
    })
  }
}

export const otherSetupController = {
  handler(request, h) {
    const page = getOtherSetupPage(request.params.id)

    if (!page) {
      throw Boom.notFound()
    }

    return h.view('setup/other', {
      pageTitle: page.title,
      heading: page.title,
      breadcrumbs: setupBreadcrumbs,
      page
    })
  }
}
