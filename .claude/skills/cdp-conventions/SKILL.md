---
name: cdp-conventions
description: How code is organised and written in Defra's Core Delivery Platform (CDP) Node.js frontend and backend templates. Use before writing, testing or reviewing any code in this repo.
user-invocable: false
---

# CDP template conventions

These notes describe the usual CDP template layout. **Always check the repo first**: if the template in front of you differs, follow the template, not these notes.

## Frontend template (Hapi + Nunjucks + GOV.UK Frontend)

Checked against `cdp-node-frontend-template` v0.15.0 (Node.js 24, GOV.UK Frontend 6, Vitest).

```
src/
├── config/                       # convict config (config.js) and Nunjucks setup
├── client/                       # front-end JavaScript and SCSS (built with Vite)
└── server/
    ├── server.js                 # createServer(): server setup
    ├── plugins/
    │   ├── router.js             # registers every route plugin
    │   ├── session-cache.js      # @hapi/yar session (request.yar)
    │   └── csrf.js               # @hapi/crumb CSRF protection
    ├── common/
    │   ├── templates/layouts/page.njk   # base layout every page extends
    │   ├── components/           # shared view components
    │   ├── constants/status-codes.js
    │   └── helpers/
    └── routes/
        └── <feature>/
            ├── index.js          # a Hapi plugin that registers the feature's routes
            ├── controller.js     # exports a controller object with a handler(request, h)
            ├── controller.test.js
            └── index.njk         # the view, rendered as h.view('<feature>/index', {...})
test-helpers/                     # shared test helpers
```

To add a page:

1. Copy the shape of `src/server/routes/about/`.
2. Export a controller object with a `handler(request, h)` for GET, and another for POST that validates and redirects.
3. Export a plugin from `index.js` that calls `server.route([...])`, then register it in `src/server/plugins/router.js` next to `home` and `about`.
4. Extend `layouts/page.njk` using the search path, never a relative path.
5. Pass `pageTitle` to the view. The layout builds the browser title as `<pageTitle> | <serviceName>`; keep that pattern.
6. Import internal files with the `#/` subpath imports (for example `import { config } from '#/config/config.js'`).

## Validation and errors

- Validate on the server with Joi.
- On error, re-render the same view with: the user's answer, an `errorList` for `govukErrorSummary`, and an `errorMessage` for the field.
- Prefix the page title with `Error: ` when there are errors.

## Session

Store answers between pages with the template's session: `request.yar.get()` and `request.yar.set()` (set up in `src/server/plugins/session-cache.js`). Do not add a new session library.

Forms must include the CSRF token handled by `src/server/plugins/csrf.js`. Check how existing forms pass it.

## Backend template (Hapi + MongoDB)

- Follow the example route in the backend template for folder layout and tests.
- Validate the request payload with Joi.
- Return clear status codes (`201` created, `400` bad request).
- The frontend calls the backend with native `fetch`, with the base URL taken from config, never hard-coded.

## Code style

- ES modules with named exports.
- Use the template's logger (`request.logger`), never `console.log`. Never log personal data.
- Native `fetch`, not Axios.
- Run `npm run lint` and fix all problems before finishing.

## Tests

- The template uses Vitest (`npm test` runs `vitest run --coverage`). Do not add another framework.
- Controller tests create the server with `createServer()` from `#/server/server.js`, call `server.initialize()`, then use `server.inject()` and check `statusCode` and the HTML. Copy `src/server/routes/about/controller.test.js`.
- Put tests next to the code: `controller.test.js`.

## Never

- Express, custom CSS, custom components, new npm packages without asking.
- Reading or writing `.env` files or secrets. Secrets live in the CDP Portal.
