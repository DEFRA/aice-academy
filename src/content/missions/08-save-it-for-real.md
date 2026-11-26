---
number: 8
slug: save-it-for-real
stage: Build
title: Save it for real
summary: Save every report in a database, so none get lost.
badge: Full stack
time: About 3 hours
build: A second service that saves each report and gives back a reference number.
learn: How the part people see and the part that stores things work together.
team: The whole team, plus a person who's a developer if you'd like help
checks:
  - When I send a report, it's saved
  - The confirmation page shows the saved report's reference number
  - Claude told me the tests pass in both services
huddle: Why do we keep the address of the saving service in settings instead of in the code?
lead:
  - software-development
  - architecture
  - data
stuck:
  - problem: It can't connect to the database
    fix: 'In a codespace, the database is already running. Ask: Check the backend connects to MongoDB at mongodb://127.0.0.1:27017. If you set up outside a codespace, you need Docker: ask your facilitator.'
  - problem: Both services want the same port
    fix: 'Ask: Make sure the frontend uses port 3000 and the backend uses port 3001.'
---

## What you'll do

So far, reports disappear when they're sent. You'll add a second service, the [backend](/glossary#backend), which saves each report in a [database](/glossary#database) and gives back a reference number. Your pages are the [frontend](/glossary#frontend). Real Defra services work this way too.

In a codespace, the database is already set up for you.

## Steps

### 1. Set up the backend

```
Set up the CDP backend template next to my service in a folder called hedgehog-sightings-backend, copy our team into it, install it and check it can reach the database. Explain each step simply.
```

Claude will ask permission for several commands. Read each one, then allow it.

### 2. Teach the backend to save reports

Open a new terminal with **+**, then go into the backend folder and start Claude there:

```bash
cd ../hedgehog-sightings-backend
claude
```

Then type:

```
/golden-loop Save a sighting
```

### 3. Connect your pages to the backend

Go back to your first Claude terminal and type:

```
/golden-loop Send the report to the backend
```

### 4. See it saved

Send a report in the **Your service** tab, then ask:

```
Show me the reports saved in the database.
```
