# AICE Academy starter kit

Everything Claude Code needs to work as a delivery team on a CDP service: a team handbook, seven specialist agents, eight skills and three automatic checks. Mission 0 in the AICE Academy service walks you through setting it up.

## Set up

From the folder where you keep your code:

```bash
git clone --depth 1 https://github.com/DEFRA/cdp-node-frontend-template.git hedgehog-sightings
git clone --depth 1 https://github.com/DEFRA/aice-academy.git
cd hedgehog-sightings
rm -rf .git
git init
cp -R ../aice-academy/starter-kit/. .
nvm install
npm install
npm test
git add -A
git commit -m "Start from the CDP frontend template with the academy starter kit"
claude
```

Then type `/academy` in Claude Code.

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
