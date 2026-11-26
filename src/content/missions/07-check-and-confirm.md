---
number: 7
slug: check-and-confirm
stage: Build
title: Check and confirm
summary: Let people check their answers, and confirm their report has been sent.
badge: Finisher
time: About 2 hours
build: A page to check your answers, a confirmation page and a test of the whole journey.
learn: Why we test the whole journey, not just each page.
team: The tester leads, with the developer, content designer and accessibility checker
checks:
  - The check your answers page shows every answer with a Change link
  - The confirmation page shows a reference number
  - Claude told me the whole-journey test passed
huddle: What would we have missed if we'd only tested each page on its own?
lead:
  - business-analysis
  - testing
stuck:
  - problem: The Change links take me to the wrong page
    fix: 'Ask: The Change link for [answer] goes to the wrong page. Can the team fix it?'
---

## What you'll do

You'll add two pages every GOV.UK form has: one where people check their answers before sending, and one that confirms it worked. Then the tester writes a test that walks through the whole journey like a real person.

## Steps

### 1. Check your answers

```
/golden-loop Check your answers
```

### 2. Confirmation

```
/golden-loop Confirmation
```

### 3. Test the whole journey

```
Ask the tester for a test that goes from the start page to confirmation, like a real person, including changing one answer.
```

Each page can work on its own while the journey between them breaks. This test catches that.
