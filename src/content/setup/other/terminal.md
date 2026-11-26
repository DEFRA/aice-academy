---
title: Set up in a terminal
---

### Before you start

Check you have the tools. Each of these should print a version number:

```bash
node --version
git --version
claude --version
```

If Node.js is missing, install [nvm](https://github.com/nvm-sh/nvm) and run `nvm install 24`. On Windows, use WSL.

### 1. Get the practice service

```bash
git clone https://github.com/DEFRA/aice-academy-practice.git hedgehog-sightings
cd hedgehog-sightings
```

It's Defra's CDP frontend template with the academy starter kit already added.

### 2. Install and test

```bash
nvm install
npm install
npm test
```

### 3. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Leave it running, and open a second terminal in the same folder.

### 4. Start the academy

```bash
claude
```

Then type `/academy`.

### Watch out for

- **npm install fails:** you may be on a restricted network. Ask your facilitator.
- **Port 3000 is already in use:** another copy is running. Stop it with Ctrl+C.
