---
number: 5
slug: first-page-test-first
stage: Build
title: Build your first pages
summary: Build the start page and the first question, checking them as you go.
badge: Red to green
time: About 2 hours
build: Your start page and your first question page, working and tested.
learn: The golden loop, the way your team builds and checks every feature.
team: The whole team
checks:
  - My start page and first question page work in the Your service tab
  - Leaving the question blank shows an error at the top and next to the question
  - I saw the tests fail before the pages were built
  - Claude told me all the tests passed
  - I've saved a checkpoint
huddle: What did the failing test tell you before any page existed?
lead:
  - software-development
  - testing
stuck:
  - problem: The tests didn't fail first
    fix: "Ask: Why didn't the tests fail before the page was built? A test that never fails may not be checking anything."
  - problem: Claude keeps fixing failing tests without me asking
    fix: That's the automatic checks working. They run the tests every time Claude changes something, so problems get fixed straight away.
  - problem: I can't find my new page
    fix: "Ask: What's the web address of the page you built? Then add it to the end of the address in the Your service tab."
---

## What you'll do

You'll build your first two pages. Your team builds everything the same way, called the **golden loop**:

1. **Agree what good looks like.**
2. **Write a test first.** A [test](/glossary#test) is a small program that checks something works. It fails at first, because the page doesn't exist yet. That proves it can spot a problem.
3. **Build** until the test passes.
4. **Check:** three teammates check accessibility, the words and the code.
5. **You approve.**

## Steps

### 1. Build the start page

```
/golden-loop Start page
```

This shortcut starts the whole loop. It takes 10 to 20 minutes. Claude tells you which stage it's on.

**Claude will stop and ask you twice:** "Is this what we want to build?" and, at the end, "Happy with this?" Answer in your own words. It will also ask permission to create files and run tests. Allow these.

**While you wait,** Claude gives you small jobs, like guessing the mistake people are most likely to make. Do them: they're how you stay in charge.

### 2. Look at it

When Claude says it's done, go to the **Your service** tab and refresh. If you can't see the new page, ask Claude for its web address.

### 3. Save a checkpoint

At the end of each loop, Claude offers to save a [checkpoint](/glossary#commit) of your work. Say yes. It's like saving a version of a document, so you can always go back.

### 4. Build the first question

```
/golden-loop Where did you see the hedgehog
```

### 5. Try to break it

On the new page, leave the box empty and select **Continue**. You should see a red error at the top and next to the question. That's the test you watched fail, now passing.
