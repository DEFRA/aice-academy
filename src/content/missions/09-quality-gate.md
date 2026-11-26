---
number: 9
slug: quality-gate
stage: Finish
title: Quality check
summary: Check your service works for everyone, and fix what needs fixing.
badge: Gatekeeper
time: About 2 hours
build: A quality report, and the fixes it asks for.
learn: Using several teammates as one quality check, and what only a person can check.
team: The accessibility checker, content designer and reviewer, working at the same time
checks:
  - The quality report has no Must fix items left
  - I've used the whole journey with a keyboard only
  - I've tried the journey with a screen reader
  - I've checked the pages zoomed in to 400%
huddle: What did you find by hand that the teammates missed?
lead:
  - content-design
  - user-research
stuck:
  - problem: I've never used a screen reader
    fix: On a Mac, press Cmd and F5 together to turn VoiceOver on and off. On Windows, ask your facilitator about NVDA, a free screen reader. Ask them for a 5-minute demo.
  - problem: I don't understand the quality report
    fix: 'Ask: Explain the quality report simply. What are the three most important things to fix?'
---

## What you'll do

Three teammates check your whole service at the same time, and write a report. You fix what they find. Then you do the checks only a person can do: using it the way people with different needs do.

## Steps

### 1. Run the quality check

```
/quality-gate
```

### 2. Fix anything marked Must fix

For each one, type `/golden-loop` followed by what needs fixing.

### 3. Check it yourself

- **Keyboard only:** go through the whole journey without your mouse. Press **Tab** to move and **Enter** to choose.
- **Screen reader:** turn on a [screen reader](/glossary#screen-reader) and listen to one page.
- **Zoom:** press **Ctrl** and **+** (on a Mac, **Cmd** and **+**) until your browser is at 400%. Can you still use every page?
