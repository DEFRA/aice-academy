import { howItWorksController } from './controller.js'

/**
 * Sets up the routes used in the how it works page.
 * These routes are registered in src/server/plugins/router.js.
 */
export const howItWorks = {
  plugin: {
    name: 'how-it-works',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/how-it-works',
          ...howItWorksController
        }
      ])
    }
  }
}
