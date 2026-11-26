---
title: Set up in the Claude desktop app
---

### Before you start

You need the Claude desktop app, plus Node.js 24 and Git on your laptop. If you're not sure you have them, ask your facilitator to check before your first session. Installing them often needs IT.

### 1. Make a folder

Make a new, empty folder called `aice-academy` in your Documents folder.

### 2. Open Claude Code

Open the Claude desktop app and select the **Code** tab. Choose your `aice-academy` folder when it asks which folder to work in.

### 3. Ask Claude to set everything up

Copy this message and send it to Claude:

```
Set up my AICE Academy practice service in this folder. Clone https://github.com/DEFRA/aice-academy-practice.git into a folder called hedgehog-sightings, use the Node.js version in its .nvmrc file, install its dependencies and run its tests. Explain each step in one plain sentence. Don't change any files.
```

Claude will ask permission before running each command. Read what it's about to do, then allow it.

### 4. Open the practice folder

When Claude says the tests pass, start a new session in the Code tab and choose the `hedgehog-sightings` folder inside `aice-academy`. This is where the academy's team handbook and agents live.

### 5. See your service

Send this message:

```
Start the service and show it to me.
```

Claude starts it and opens it in the Browser pane. You'll see the CDP frontend template's home page.

### 6. Start the academy

Type `/academy` and send it.
