---
number: 10
slug: ship-and-show
stage: Finish
title: Ship and show
summary: Share your work properly, and show it to your cohort.
badge: Shipped it
time: About 2 hours
build: Your work shared on GitHub, with every automatic check passing, and a show and tell.
learn: How people and automatic checks work together before anything goes live.
team: The reviewer, then Claude helps you prepare your show and tell
checks:
  - My pull request shows all checks passing
  - I've given my show and tell
huddle: Where in your real job will you use the golden loop first?
lead:
  - product-delivery
stuck:
  - problem: GitHub says I don't have permission
    fix: You need your own copy, called a fork. In a codespace, choose Create fork when GitHub offers. Otherwise, ask Claude to help you make one.
  - problem: The checks don't run on my pull request
    fix: In your fork on GitHub, open the Actions tab and select the button to turn on workflows. Then ask Claude to push again.
  - problem: A check fails
    fix: 'Ask: My pull request check failed. Find out why and fix it.'
---

## What you'll do

You'll share your work the way real teams do: in a [pull request](/glossary#pull-request), where automatic checks run on it and people can review it. Then you'll show your service to your cohort.

## Steps

### 1. Share your work

```
Help me save my work to my own copy of the practice repository on GitHub and open a pull request. Explain each step simply and ask me before doing anything.
```

Your practice workspace belongs to AICE, so you'll save to your own copy, called a [fork](/glossary#fork). In a codespace, GitHub offers to make one for you. Say yes.

### 2. Watch the checks

GitHub runs the same automatic checks a real Defra service runs: security, tidy code, tests and building the service. Ask Claude:

```
Show me the checks on my pull request and explain each one.
```

### 3. Prepare your show and tell

```
/show-and-tell
```

Claude writes a five-minute demo script and a summary of what your team did. Fill in the "What I learned" part yourself.

### 4. Show it

Present your service to your cohort. You built a real government service. Well done.
