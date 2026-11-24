import { professionController, saveProfessionController } from './controller.js'

/**
 * Sets up the routes used to choose a profession track.
 * These routes are registered in src/server/plugins/router.js.
 */
export const profession = {
  plugin: {
    name: 'profession',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/profession',
          ...professionController
        },
        {
          method: 'POST',
          path: '/profession',
          ...saveProfessionController
        }
      ])
    }
  }
}
