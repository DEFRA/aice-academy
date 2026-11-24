---
name: golden-loop
description: Runs one full golden loop for a user story - story, failing tests, build, checks and owner approval. Use for every new feature or page.
disable-model-invocation: true
argument-hint: '[story name]'
---

# The golden loop for: $ARGUMENTS

Run these steps in order. Tell the service owner which step you are on, using the step names below. Stop at every **Owner checkpoint**.

## 1. Story

Ask the **product-coach** agent to find or write the story "$ARGUMENTS" in `backlog.md`, with Given / When / Then acceptance criteria. Mark it "Doing".

**Owner checkpoint:** "Is this what we want to build?"

## 2. Design

If the story adds or changes a page, ask the **interaction-designer** agent for the page spec in `design/pages/`, and the **content-designer** agent to check its words.

## 3. Test first (red)

Ask the **tester** agent to write tests for every acceptance criterion and run them. Show the failing output. Explain: "These fail because the feature doesn't exist yet. That proves the tests can catch problems."

## 4. Build (green)

Ask the **developer** agent to make the tests pass with the smallest clean change. The hooks will run the related tests after each edit. Keep going until `npm test` and `npm run lint` pass.

## 5. Check

Run these three agents **at the same time** and collect their reports:

- **accessibility-auditor** on the changed pages
- **content-designer** on the changed words
- **reviewer** on the whole change

Send any "Critical", "Serious" or "Must fix" items back to the developer or content-designer agent, then re-run the tests.

## 6. Show the owner

Tell the owner which URL to open (with `npm run dev` running) and what to try, including a mistake to see the error message.

**Owner checkpoint:** "Happy with this?"

## 7. Wrap up

- Mark the story "Done" in `backlog.md`.
- Append to `TEAM_LOG.md`: the story, which agents helped, what the tests prove, any decisions.
- Suggest the commit, for example:
  `git add -A && git commit -m "Add where-did-you-see-it page with validation"`
