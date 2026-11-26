---
number: 6
slug: build-the-journey
stage: Build
title: Build the journey
summary: Build the rest of the questions, taking the lead yourself.
badge: Pathfinder
time: About 3 hours
build: Every question page, with answers remembered between pages and advice for injured hedgehogs.
learn: How to run the golden loop with less help, and how to make a journey branch.
team: The whole team
checks:
  - I can go from the start page to the last question
  - My answers are still there when I go back a page
  - Saying a hedgehog is injured shows advice before the next question
  - Claude told me all the tests passed
huddle: Where did a teammate get something wrong, and how was it caught?
lead:
  - interaction-design
  - policy-operations
stuck:
  - problem: My answers disappear when I go back
    fix: 'Ask: When I go back a page, my answer has gone. Can the team fix that?'
  - problem: I don't know what to build next
    fix: "Ask: What's the next story in our list?"
---

## What you'll do

You'll build the rest of the questions: when, how many, whether the hedgehog looked injured, and an optional email address. This time, you lead.

## Steps

### 1. Find the next story

```
What's the next story in our list?
```

### 2. Run the loop yourself

Type `/golden-loop` followed by the story's name, for example:

```
/golden-loop When did you see the hedgehog
```

Repeat for each question in your list.

### 3. Make the journey branch

When someone says a hedgehog looks injured, they should see advice before the next question. Tell Claude that's what you want when you reach that story.

### 4. Walk through it

Go through the whole journey in the **Your service** tab, as if you'd just seen a hedgehog. Go back a page and check your answers are still there.
