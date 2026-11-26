# AICE Academy starter kit

Everything Claude Code needs to work as a delivery team on a CDP service: a team handbook, seven specialist agents, eight skills and three automatic checks. Mission 1 in the AICE Academy service walks you through setting it up, one step at a time.

## Set up

You don't normally copy this kit by hand. It comes ready-made in the practice repo, [DEFRA/aice-academy-practice](https://github.com/DEFRA/aice-academy-practice), which is built from this folder by `scripts/build-practice-repo.sh` in the AICE Academy repo.

Mission 1 in the AICE Academy service sets learners up in the browser, with nothing to install: they open the practice repo in GitHub Codespaces, start the service and type `/academy`.

People who already use technical tools can also:

- **use the Claude desktop app:** ask Claude to clone the practice repo and set it up
- **use a terminal:** `git clone https://github.com/DEFRA/aice-academy-practice.git hedgehog-sightings`, then `nvm install`, `npm install`, `npm test` and `claude`

To add the kit to some other CDP frontend repo, copy everything in this folder into the repo's root with `cp -R starter-kit/. /path/to/repo/`.

## What's inside

```
CLAUDE.md                     # Team handbook: how the team works, the golden loop, the rules
TEAM_LOG.md                   # Diary of what was built, by whom and why
academy/
├── README.md                 # This file
├── brief.md                  # The practice service: Report a hedgehog sighting
├── research-notes.md         # Fictional user research
├── missions.md               # Mission scripts the /academy coach follows
└── PROGRESS.md               # Your progress and badges
.claude/
├── settings.json             # Permissions and hooks
├── agents/                   # The specialist team (7 agents)
├── skills/                   # /academy, /golden-loop, /quality-gate, /show-and-tell, /explain,
│                             # plus knowledge of CDP conventions, GOV.UK components and content style
└── hooks/                    # Blocks secrets, runs related tests after edits, runs all tests before "done"
```

## Requirements

- Node.js 24 (`nvm install` reads the version from the template's `.nvmrc`) and Git
- Claude Code, with access approved for your cohort
- The hooks use Node.js only. On Windows, use WSL.

## Make it your own

- Change the practice service by replacing `academy/brief.md` and `academy/research-notes.md`.
- Add a profession-specific agent in `.claude/agents/`.
- Package the kit as a Claude Code plugin so cohorts can install it in one step.
