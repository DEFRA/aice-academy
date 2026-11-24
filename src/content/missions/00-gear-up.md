---
number: 0
slug: gear-up
title: Gear up
badge: Kitted out
time: About 1 hour
build: A practice copy of Defra's CDP frontend template running on your machine, with the academy starter kit added.
learn: What Claude Code is, and what the team handbook (CLAUDE.md) does.
team: Claude, once you've set up
prompts:
  - /academy
checks:
  - Node.js 24, Git and Claude Code are installed
  - My practice folder has CLAUDE.md and a .claude folder in it
  - npm test passes
  - The template's home page opens at http://localhost:3000
  - I've saved my starting point with git commit
  - Claude Code starts and /academy replies
huddle: What's one thing you'd never want your AI team to do without asking you?
lead: []
---

## What you're setting up

You'll make a **practice folder** on your laptop with two things in it:

- **Defra's CDP frontend template**: the same starting point real Defra services use. It already has GOV.UK styling, tests and security set up.
- **The academy starter kit**: the instructions that turn Claude into your delivery team. It's a handbook (`CLAUDE.md`), seven specialist agents, playbooks and automatic checks.

Everything stays on your machine. You don't need the CDP Portal, and you can't break anything real. You'll type commands in a **terminal**: Terminal on a Mac, or Ubuntu (WSL) on Windows.

## Step 1: check your tools

Run each command. Each one should print a version number.

```bash
node --version
git --version
claude --version
```

If one is missing:

- **Node.js**: install [nvm](https://github.com/nvm-sh/nvm), then run `nvm install 24`.
- **Git**: ask your IT service desk.
- **Claude Code**: your facilitator will tell you how your cohort gets access.

## Step 2: get the template and the starter kit

Go to the folder where you keep your work, then run:

```bash
git clone --depth 1 https://github.com/DEFRA/cdp-node-frontend-template.git hedgehog-sightings
git clone --depth 1 https://github.com/DEFRA/aice-academy.git
```

This downloads two folders: `hedgehog-sightings` (the template, which becomes your service) and `aice-academy` (where the starter kit lives).

## Step 3: make the template your own

```bash
cd hedgehog-sightings
rm -rf .git
git init
```

This disconnects your copy from the original template, so it's yours to change.

## Step 4: add the starter kit

```bash
cp -R ../aice-academy/starter-kit/. .
```

Check it worked: `ls -a` should now list `CLAUDE.md`, `TEAM_LOG.md`, `academy` and `.claude`.

## Step 5: install and test

```bash
nvm install
npm install
npm test
```

`nvm install` picks the Node.js version the template needs. `npm install` downloads its building blocks. `npm test` runs the template's tests, and they should all pass.

## Step 6: see it in your browser

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll see the template's home page. Leave this running, and open a second terminal window in the same folder for the next steps.

## Step 7: save your starting point

```bash
git add -A
git commit -m "Start from the CDP frontend template with the academy starter kit"
```

This gives you a clean point to compare every change against. The automatic checks use it too.

## Step 8: meet Claude

```bash
claude
```

When Claude Code opens, type `/academy`. Claude will check your setup, explain the team handbook and take you into Mission 1.

## Watch out for

- **"command not found: nvm"**: close the terminal and open a new one after installing nvm.
- **npm install fails**: you may be behind a proxy or on a restricted network. Ask your facilitator.
- **Port 3000 is already in use**: another copy is running. Stop it with Ctrl+C.
