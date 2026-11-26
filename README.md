# aice-academy

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_aice-academy&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=DEFRA_aice-academy)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_aice-academy&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_aice-academy)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_aice-academy&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DEFRA_aice-academy)

An internal Defra service from the AI Capability and Enablement team (AICE). It takes people from any profession through ten missions to build a working GOV.UK service on the Core Delivery Platform (CDP), with Claude and a team of AI agents.

Built on `cdp-node-frontend-template` v0.15.0 and following its structure and patterns.

- [What the service does](#what-the-service-does)
- [How the code is organised](#how-the-code-is-organised)
- [Editing content](#editing-content)
- [Working on this repo with Claude Code](#working-on-this-repo-with-claude-code)
- [Alpha limitations and next steps](#alpha-limitations-and-next-steps)

## What the service does

| Page                   | Path                        | GOV.UK components                                                    |
| ---------------------- | --------------------------- | -------------------------------------------------------------------- |
| Start page             | `/`                         | Start button, inset text                                             |
| Choose your profession | `/profession`               | Radios, error summary                                                |
| Your missions          | `/missions`                 | Task list, tags, panel on graduation                                 |
| A mission              | `/missions/{slug}`          | Summary list, inset text, checkboxes, character count, error summary |
| Mission complete       | `/missions/{slug}/complete` | Panel                                                                |
| How it works           | `/how-it-works`             | Rendered from markdown                                               |
| Glossary               | `/glossary`                 | Summary list                                                         |

Learners choose a profession, work through missions, tick the checks that prove each mission worked, add an optional team huddle answer and earn a badge. Their profession decides which missions they lead and their stretch challenges.

## How the code is organised

The service follows the template's layout. Each feature is a route plugin in `src/server/routes/<feature>/` with `index.js`, `controller.js`, `controller.test.js` and its views, registered in `src/server/plugins/router.js`.

| Path                                       | What it does                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `src/content/`                             | All learner-facing content: missions, professions, glossary and pages               |
| `src/server/common/helpers/content/`       | Loads and validates content; renders markdown to sanitised HTML with GOV.UK classes |
| `src/server/common/helpers/progress.js`    | Learner progress, held in the session (`request.yar`)                               |
| `src/server/common/helpers/form-errors.js` | Turns Joi errors into GOV.UK error summary and field errors                         |
| `src/server/routes/`                       | `home`, `profession`, `missions`, `how-it-works`, `glossary`                        |
| `test-helpers/session-helpers.js`          | Simulates a browser session (cookies and CSRF crumb) in route tests                 |

Dependencies added to the template: `marked` and `sanitize-html` (markdown is always sanitised, in line with Defra's AI SDLC conventions), `yaml` (front matter and content files) and `@hapi/boom` (page not found).

## Editing content

Content designers can change the academy without touching code.

- **Missions** live in `src/content/missions/`, one markdown file each. The front matter holds the structured parts (title, badge, prompts, checks, huddle question and the professions that lead it). The body holds extra sections such as "Owner checkpoint". Content is validated when the service starts, and the tests check every mission.
- **Professions** are in `src/content/professions.yml`. Each mission's `lead` list uses their ids.
- **Glossary** terms are in `src/content/glossary.yml`.
- **Pages** such as "How it works" are markdown in `src/content/pages/`.
- **The AI team** on the home page is in `src/content/team.yml`.
- **The learner starter kit** is in `starter-kit/`. Learners copy it with `cp -R ../aice-academy/starter-kit/. .`, so don't add a README at its root (it would overwrite theirs). Its README is `starter-kit/academy/README.md`.

Run `npm test` after any content change.

## Working on this repo with Claude Code

This repo uses the AICE Academy starter kit itself. `CLAUDE.md` is the team handbook, `.claude/agents/` holds the specialist agents, `.claude/skills/` the playbooks and `.claude/hooks/` the automatic checks: related tests run after every edit and the full suite runs before Claude finishes. Start with `/golden-loop <story>`.

## Alpha limitations and next steps

- **Progress is held in the session only.** It is lost when the session ends. Beta adds a CDP backend service with MongoDB.
- **No sign-in yet.** Beta adds staff sign-in. Confirm the recommended approach for internal Defra services with the CDP team.
- **No facilitator view yet.** Beta adds a cohort dashboard with progress, stuck learners and huddle answers.
- **Prompts can't be copied with one click.** Add a progressively enhanced copy button in `src/client/javascripts`.

---

# CDP Node.js Frontend Template

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Server-side Caching](#server-side-caching)
- [Redis](#redis)
- [Local Development](#local-development)
  - [Setup](#setup)
  - [Development](#development)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
  - [Update dependencies](#update-dependencies)
  - [Formatting](#formatting)
    - [Windows prettier issue](#windows-prettier-issue)
- [Docker](#docker)
  - [Development image](#development-image)
  - [Production image](#production-image)
  - [Docker Compose](#docker-compose)
  - [Dependabot](#dependabot)
  - [SonarCloud](#sonarcloud)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd cdp-node-frontend-template
nvm use
```

## Server-side Caching

We use Catbox for server-side caching. By default the service will use CatboxRedis when deployed and CatboxMemory for
local development.
You can override the default behaviour by setting the `SESSION_CACHE_ENGINE` environment variable to either `redis` or
`memory`.

Please note: CatboxMemory (`memory`) is _not_ suitable for production use! The cache will not be shared between each
instance of the service and it will not persist between restarts.

## Redis

Redis is an in-memory key-value store. Every instance of a service has access to the same Redis key-value store similar
to how services might have a database (or MongoDB). All frontend services are given access to a namespaced prefixed that
matches the service name. e.g. `my-service` will have access to everything in Redis that is prefixed with `my-service`.

If your service does not require a session cache to be shared between instances or if you don't require Redis, you can
disable setting `SESSION_CACHE_ENGINE=false` or changing the default value in `src/config/index.js`.

## Proxy

We are using forward-proxy which is set up by default. Services are automatically configured with the proxy environment variables when deployed.

Node.js 24 uses these variables to route outbound HTTP(S) requests through the proxy:

NODE_USE_ENV_PROXY=1
HTTPS_PROXY=...
NO_PROXY=...

No additional proxy configuration is required in the service.

## Local Development

### Setup

Install application dependencies:

```bash
npm install
```

### Git hooks

Install git hooks (optional)

```bash
npm run git:hooks
```

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
npm run
```

### Update dependencies

To update dependencies use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

> The following script is a good start. Check out all the options on
> the [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

```bash
ncu --interactive --format group
```

### Formatting

#### Windows prettier issue

If you are having issues with formatting of line breaks on Windows update your global git config by running:

```bash
git config --global core.autocrlf false
```

## Docker

### Development image

> [!TIP]
> For Apple Silicon users, you may need to add `--platform linux/amd64` to the `docker run` command to ensure
> compatibility fEx: `docker build --platform=linux/arm64 --no-cache --tag cdp-node-frontend-template`

Build:

```bash
docker build --target development --no-cache --tag cdp-node-frontend-template:development .
```

Run:

```bash
docker run -p 3000:3000 cdp-node-frontend-template:development
```

### Production image

Build:

```bash
docker build --no-cache --tag cdp-node-frontend-template .
```

Run:

```bash
docker run -p 3000:3000 cdp-node-frontend-template
```

### Docker Compose

A local environment with:

- Floci (replacing Localstack) for AWS services (S3, SQS)
- Redis
- MongoDB
- This service.
- A commented out backend example.

```bash
docker compose up --build -d
```

### Dependabot

We have added an example dependabot configuration file to the repository. You can enable it by renaming
the [.github/example.dependabot.yml](.github/example.dependabot.yml) to `.github/dependabot.yml`

### SonarCloud

Instructions for setting up SonarCloud can be found in [sonar-project.properties](./sonar-project.properties).

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
