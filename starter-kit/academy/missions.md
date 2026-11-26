# Mission scripts (for the /academy coach)

The AICE Academy service is the source of truth for what the learner reads: goals, steps, checks and help. This file only tells you, the coach, how to run each mission with them. If the two ever disagree, follow the service and tell the learner so AICE can fix this file.

Each mission lists: the goal, the ideas it teaches, the steps (with **Owner checkpoints**), the checks that prove it worked, and the team huddle question. Run the steps in order. Keep explanations short and plain.

---

## Mission 1: Get set up

**Goal:** confirm the learner's practice workspace is set up and running. Most learners use the browser route (a GitHub codespace); a few use the desktop app or a terminal.
**Teaches:** what Claude Code is; what `CLAUDE.md` is (the team handbook).
**Context:** the learner has followed the six setup steps in the AICE Academy service and has just typed `/academy` for the first time. Many learners are not technical: explain every command you run in one plain sentence, and run commands for them rather than asking them to type.
**Steps:**

1. Welcome them warmly. If `CODESPACES` is set they used the browser route; otherwise ask which route they used. In a codespace (`CODESPACES` is set), the database for Mission 8 is already running.
2. Check `node --version` matches `.nvmrc`. If not, run `nvm install` for them.
3. Check `CLAUDE.md`, `academy/` and `.claude/` exist. If not, they may have cloned the plain CDP template: point them back to the setup steps in the AICE Academy service.
4. Check `node_modules` exists. If not, run `npm install`.
5. Run `npm test`. Explain in one sentence what the output means.
6. Make sure the service is running (`npm run dev`) and the learner can see it: the "Your service" tab in a codespace, the Browser pane in the desktop app, or http://localhost:3000.
7. Show them `CLAUDE.md` and explain it in three bullets.
   **It worked when:** `npm test` passes and the learner can see the service's home page.
   **Huddle:** "What is one thing you'd never want your AI team to do without asking you?"

---

## Mission 2: Meet your team

**Goal:** the learner knows each agent, has toured the code, and has made a first small change safely.
**Teaches:** subagents (specialist teammates), skills (playbooks), plan mode (think before doing).
**Steps:**

1. List the agents in `.claude/agents/` and the skills in `.claude/skills/` in a table: name, job, everyday comparison.
2. Use the built-in Explore agent to answer: "How does a web address become a page on screen in this template?" Then `/explain src/server/plugins/router.js`.
3. Ask the learner to add one personal rule to the bottom of `CLAUDE.md` (for example, "Explain things using cooking comparisons").
4. Ask the learner to switch to plan mode (Shift+Tab) and ask for: "Change the service name to Report a hedgehog sighting."
5. **Owner checkpoint:** approve the plan.
6. Make the change with the tester and developer agents. Update any test that checks the service name.
   **It worked when:** the header shows "Report a hedgehog sighting" and `npm test` passes.
   **Huddle:** "Which agent would you most like on your real team, and why?"

---

## Mission 3: Know your users

**Goal:** a prioritised backlog of user stories with testable acceptance criteria.
**Teaches:** delegating to a specialist agent; why acceptance criteria matter to agents.
**Steps:**

1. Ask the product-coach agent to read `academy/brief.md` and `academy/research-notes.md` and write user needs and stories in `backlog.md`.
2. Ask the content-designer agent to check the words in the stories for consistency.
3. **Owner checkpoint:** the learner orders the stories and moves anything not needed for a first journey to "Later".
4. Point out one acceptance criterion that came straight from the research.
   **It worked when:** `backlog.md` has at least 6 stories, each with Given / When / Then criteria that include an error case, in an order the learner chose.
   **Huddle:** "Which research finding changed a story?"

---

## Mission 4: Design the journey

**Goal:** an approved journey and a spec for every page.
**Teaches:** agents with preloaded skills; running agents in parallel.
**Steps:**

1. Ask the interaction-designer agent to map the journey in `design/journey.md` and write page specs in `design/pages/`.
2. In parallel, ask the content-designer agent to check the wording and the accessibility-auditor agent to review the specs.
3. Summarise the feedback in a short table and apply the agreed changes.
4. **Owner checkpoint:** the learner approves the journey. Ask: "Is there any question we could remove?"
5. Optional: show a quick GOV.UK-styled preview of one page, or use the Prototype Kit.
   **It worked when:** `design/journey.md` and a spec per page exist, and the learner has approved them.
   **Huddle:** "Which question did you remove or change, and why?"

---

## Mission 5: Build your first pages

**Goal:** the start page and the first question page work, built test first.
**Teaches:** the golden loop; hooks (automatic checks); red then green.
**Steps:**

1. Explain the golden loop in four lines.
2. Run `/golden-loop Start page`.
3. Run `/golden-loop Where did you see the hedgehog`.
4. When a hook catches a failing test, pause and point it out: "That was the hook doing its job."
5. **Owner checkpoint:** the learner tries both pages in the browser, including leaving the question blank.
   **It worked when:** both pages work in the browser, the error message appears in the summary and by the field, and `npm test` passes.
   **Huddle:** "What did the failing test tell you before any code existed?"

---

## Mission 6: Build the journey

**Goal:** every question page works, in order, with answers saved between pages.
**Teaches:** running the loop with less help; sessions; branching.
**Steps:**

1. Run `/golden-loop` for each remaining question story in backlog order (date, how many, condition, email).
2. For the condition question, include the branch: if injured, show advice about contacting a local hedgehog rescue before continuing.
3. Encourage the learner to write the next prompt themselves. Step in less each time.
4. **Owner checkpoint** at the end of each loop.
   **It worked when:** the learner can go from the start page to the last question with answers remembered, and `npm test` passes.
   **Huddle:** "Where did an agent get something wrong, and how did the loop catch it?"

---

## Mission 7: Check and confirm

**Goal:** check your answers, change links, a confirmation page, and a test of the whole journey.
**Teaches:** end-to-end tests; why we test the whole journey, not just pages.
**Steps:**

1. Run `/golden-loop Check your answers` (with a working "Change" link for every answer).
2. Run `/golden-loop Confirmation` (a `govukPanel` with a made-up reference number for now).
3. Ask the tester agent for a journey test that walks start to confirmation, including one change of answer. Use the end-to-end tool the template supports; if none, use a sequence of `server.inject()` calls.
   **It worked when:** the journey test passes from start to confirmation.
   **Huddle:** "What would have been missed if we had only tested each page on its own?"

---

## Mission 8: Save it for real

**Goal:** reports are saved by a CDP backend service and the confirmation shows a real reference.
**Teaches:** frontend and backend services; contracts between them; config instead of hard-coding.
**Steps:**

1. The learner sets up the CDP Node.js backend template alongside the frontend (with a developer buddy if they are not a developer), copying in the academy kit.
2. In the backend, run `/golden-loop Save a sighting`: a POST endpoint that validates the report, stores it and returns a reference.
3. In the frontend, run `/golden-loop Send the report`: on submit, call the backend using a base URL from config, then show the returned reference.
4. Tests on both sides. In the frontend, the backend call is mocked in unit tests.
5. **Owner checkpoint:** submit a report locally and see it stored.
   **It worked when:** a submitted report is stored by the backend, the confirmation shows its reference, and tests pass in both repos.
   **Huddle:** "Why do we keep the backend address in config instead of in the code?"

---

## Mission 9: Quality check

**Goal:** the service passes a full quality sweep.
**Teaches:** using several agents as one quality gate; what people must still check themselves.
**Steps:**

1. Run `/quality-gate`.
2. Fix every "Must fix" item with `/golden-loop`.
3. The learner does the manual checks: keyboard only, a screen reader (VoiceOver or NVDA), and zoom to 400%.
4. **Owner checkpoint:** the learner signs off the report.
   **It worked when:** `quality-report.md` has no "Must fix" items and the learner has done the manual checks.
   **Huddle:** "What did you find by hand that the agents missed?"

---

## Mission 10: Ship and show

**Goal:** the work is in a pull request, the pipeline is green, and the learner presents it.
**Teaches:** how human approval and the pipeline work together; telling the story of the work.
**Steps:**

1. Help the learner create a branch, commit and push (the learner runs the git commands).
2. The learner opens a pull request. Check the pipeline runs green. Explain each check.
3. If the cohort has a CDP development environment, deploy with the facilitator or a platform buddy.
4. Run `/show-and-tell`.
5. **Owner checkpoint:** the learner presents to the cohort.
   **It worked when:** the pull request pipeline is green and the show and tell is done.
   **Huddle:** "Where in your real job will you use the golden loop first?"
