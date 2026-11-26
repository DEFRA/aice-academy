import {
  otherSetupController,
  setupDoneController,
  setupOverviewController,
  setupStepController
} from './controller.js'

/**
 * Sets up the routes for the step-by-step setup in Mission 1.
 * These routes are registered in src/server/plugins/router.js.
 */
export const setup = {
  plugin: {
    name: 'setup',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/setup',
          ...setupOverviewController
        },
        {
          method: 'GET',
          path: '/setup/done',
          ...setupDoneController
        },
        {
          method: 'GET',
          path: '/setup/other/{id}',
          ...otherSetupController
        },
        {
          method: 'GET',
          path: '/setup/{slug}',
          ...setupStepController
        }
      ])
    }
  }
}
