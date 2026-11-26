import inert from '@hapi/inert'

import { home } from '../routes/home/index.js'
import { profession } from '../routes/profession/index.js'
import { missions } from '../routes/missions/index.js'
import { setup } from '../routes/setup/index.js'
import { claudePermissions } from '../routes/claude-permissions/index.js'
import { howItWorks } from '../routes/how-it-works/index.js'
import { glossary } from '../routes/glossary/index.js'
import { health } from '../routes/health/index.js'
import { cookies } from '../routes/cookies/controller.js'
import { serveStaticFiles } from './serve-static-files.js'
import { config } from '#/config/config.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])
      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])
      // Cookie consent & policy page
      await server.register([cookies])

      // Application specific routes, add your own routes here
      await server.register([
        home,
        profession,
        missions,
        setup,
        claudePermissions,
        howItWorks,
        glossary
      ])

      // Static assets
      if (!config.get('isProduction') && !config.get('isTest')) {
        await (async () => {
          const createViteServer = (await import('vite')).createServer
          const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
          })

          await server.register({
            plugin: (await import('@defra/hapi-connect')).default,
            options: {
              path: '/public',
              middleware: [vite.middlewares]
            }
          })
        })()
      } else {
        server.register(serveStaticFiles)
      }
    }
  }
}
