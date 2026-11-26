---
number: 2
slug: meet-your-team
stage: Get set up
title: Meet your team
summary: Find out what each AI teammate does, and make your first small change.
badge: Team player
time: About 1 hour
build: "Your first change: your service's name at the top of every page."
learn: How to ask Claude for things, and how to check its plan before it acts.
team: All seven teammates. The tester and developer make the change.
checks:
  - The top of my service now says Report a hedgehog sighting
  - Claude told me all the tests passed
  - I've added my own rule to the team handbook
huddle: Which teammate would you most like on your real team, and why?
lead: []
stuck:
  - problem: Claude keeps asking permission
    fix: That's normal and safe. Read [when Claude asks permission](/claude-permissions) to see what to allow.
  - problem: Shift and Tab doesn't switch on plan mode
    fix: Select inside the Claude terminal first, then press them together again. Watch the bottom of the terminal, where it says which mode you're in.
  - problem: My service still shows the old name
    fix: Refresh the Your service tab. If it's still old, ask Claude "Is the service still running? My page hasn't changed."
---

## What you'll do

You'll meet the seven AI teammates who'll build with you, see how a web page is put together, and make your first change: putting your service's name at the top of every page.

## Where to talk to Claude

Type to Claude in the terminal where you started it. We'll call it **the Claude terminal**. Type your message and press **Enter**.

## Steps

### 1. Ask Claude to introduce your team

Copy this into the Claude terminal:

```
Introduce my team. Show me each teammate, what they do and an everyday comparison for each.
```

Claude reads its team list and replies. You don't need to approve anything.

### 2. See how a page is made

```
Show me how a web address turns into a page on screen in this service. Explain it simply and show me the files involved.
```

Claude reads some files and explains. Ask follow-up questions as if Claude were a patient colleague, such as "What's a route?" or "Can you say that more simply?"

### 3. Ask for a plan before a change

Switch on **plan mode**, where Claude explains what it'll do and waits for you before changing anything. Select inside the Claude terminal and press **Shift** and **Tab** together until the bottom of the terminal says plan mode is on.

Then type:

```
Change the service name to "Report a hedgehog sighting".
```

Claude explains its plan. Read it. If it makes sense, choose the option to go ahead.

### 4. Watch the team make the change

Claude asks the tester and developer teammates to do the work. It will ask permission to change files and run tests. These are safe to allow. If you're unsure, read [when Claude asks permission](/claude-permissions).

When it's finished, Claude tells you the [tests](/glossary#test) passed.

### 5. See your change

Go to the **Your service** tab and refresh it. The top of the page now says **Report a hedgehog sighting**.

### 6. Add your own rule

The [team handbook](/glossary#claude-md) is a file of rules Claude reads every time it starts. Add one of your own:

```
Add a rule to the bottom of the team handbook: always explain things using cooking comparisons.
```

Pick any comparison you like: gardening, football, music. Then ask Claude a question and see how its answers change.
