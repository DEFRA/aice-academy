import { glossaryController } from './controller.js'

/**
 * Sets up the routes used in the glossary page.
 * These routes are registered in src/server/plugins/router.js.
 */
export const glossary = {
  plugin: {
    name: 'glossary',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/glossary',
          ...glossaryController
        }
      ])
    }
  }
}
