import { claudePermissionsController } from './controller.js'

/**
 * Sets up the routes used in the Claude permissions guide.
 * These routes are registered in src/server/plugins/router.js.
 */
export const claudePermissions = {
  plugin: {
    name: 'claude-permissions',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/claude-permissions',
          ...claudePermissionsController
        }
      ])
    }
  }
}
