---
number: 6
slug: check-and-confirm
title: Check and confirm
badge: Finisher
time: About 2 hours
build: Check your answers (with change links), the confirmation page, and a test of the whole journey.
learn: End-to-end tests, and why testing pages one at a time isn't enough.
team: The tester leads, with the developer, content-designer and accessibility-auditor
prompts:
  - /golden-loop Check your answers
  - /golden-loop Confirmation
  - Ask the tester for a journey test from the start page to confirmation, including changing one answer.
checks:
  - Check your answers shows every answer with a change link
  - The confirmation page shows a reference
  - The journey test passes from start to finish
huddle: What would we have missed if we'd only tested each page on its own?
lead:
  - business-analysis
  - testing
---

## Why a journey test?

Each page can work on its own and the journey can still break between them. A journey test walks through every page like a real user would.
