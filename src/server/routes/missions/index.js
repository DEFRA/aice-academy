import {
  completeMissionController,
  missionCompleteController,
  missionController,
  missionsController
} from './controller.js'

/**
 * Sets up the routes used for the missions.
 * These routes are registered in src/server/plugins/router.js.
 */
export const missions = {
  plugin: {
    name: 'missions',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/missions',
          ...missionsController
        },
        {
          method: 'GET',
          path: '/missions/{slug}',
          ...missionController
        },
        {
          method: 'POST',
          path: '/missions/{slug}',
          ...completeMissionController
        },
        {
          method: 'GET',
          path: '/missions/{slug}/complete',
          ...missionCompleteController
        }
      ])
    }
  }
}
