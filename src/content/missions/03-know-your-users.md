---
number: 3
slug: know-your-users
stage: Plan
title: Know your users
summary: Turn research about real needs into a to-do list for your service.
badge: Needs finder
time: About 1.5 hours
build: A list of what to build, in the order you choose.
learn: How to hand a job to one teammate, and why being clear about "done" helps AI do good work.
team: The product coach and content designer
checks:
  - I have a list of at least six user stories
  - Each story says how we'll know it works, including when someone makes a mistake
  - I've put the stories in the order I want
huddle: Which piece of research changed what you decided to build?
lead:
  - product-delivery
  - business-analysis
  - user-research
  - policy-operations
stuck:
  - problem: The stories feel too big
    fix: 'Ask: Split any story that covers more than one page into smaller stories.'
  - problem: I can't find the backlog file
    fix: "Ask Claude: Show me the stories in a table. You don't need to open the file yourself."
---

## What you'll do

Every good service starts with the people who'll use it. You'll read some made-up research about people who spot hedgehogs. Then your product coach will turn it into [user stories](/glossary#user-story): short descriptions of what people need, each with a clear test of when it's done.

## Steps

### 1. Read the brief

```
Show me the service brief and the research notes. Summarise each in five bullet points.
```

### 2. Ask the product coach for stories

```
Ask the product coach to turn the brief and research notes into user stories with acceptance criteria.
```

[Acceptance criteria](/glossary#acceptance-criteria) describe exactly how we'll know a story works, in a "Given, When, Then" form. For example: "Given I'm on the location page, when I leave it blank and continue, then I see an error."

Claude will ask permission to create a file called `backlog.md` for the list. Allow it.

### 3. Read the stories

```
Show me the stories in a table, with a one-line summary of each.
```

### 4. Decide the order

This is your decision, not Claude's. Tell Claude what matters most, for example:

```
Put the location question first. Move photo uploads to Later, we don't need them yet.
```

The content designer checks the words in your stories are clear and consistent.
