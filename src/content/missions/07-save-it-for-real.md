---
number: 7
slug: save-it-for-real
title: Save it for real
badge: Full stack
time: About 3 hours
build: A CDP backend service that saves each report and returns a reference, connected to your frontend.
learn: How frontend and backend services talk to each other, and why addresses live in config, not code.
team: The whole team, plus a human developer buddy if you're not a developer
prompts:
  - /golden-loop Save a sighting
  - /golden-loop Send the report to the backend
checks:
  - A submitted report is saved by the backend
  - The confirmation shows the backend's reference
  - Tests pass in both repos
huddle: Why do we keep the backend's address in config instead of in the code?
lead:
  - software-development
  - architecture
  - data
---

## Two repos

Run the first prompt in the backend repo and the second in the frontend repo. Copy the starter kit into the backend repo too.

## Owner checkpoint

Submit a report on your machine and see it saved.
