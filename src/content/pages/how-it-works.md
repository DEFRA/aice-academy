## You're the service owner. Claude is your delivery team.

You don't need to be a developer. You need to know what good looks like and be willing to decide. Claude leads a team of specialist AI agents. They propose and do the work. You decide.

## Meet your team

| Teammate              | Their job                                                              |
| --------------------- | ---------------------------------------------------------------------- |
| You                   | Service owner. Set direction, make decisions, approve every change     |
| Claude                | Team lead. Plans the work and brings in the right specialist           |
| product-coach         | Turns the brief and research into user stories and acceptance criteria |
| interaction-designer  | Maps the journey and specs each page using GOV.UK patterns             |
| content-designer      | Writes and checks every word against GOV.UK style                      |
| developer             | Builds on the CDP templates to make the tests pass                     |
| tester                | Writes tests before the code exists, then proves it works              |
| accessibility-auditor | Checks every page works for everyone, to WCAG 2.2 AA                   |
| reviewer              | Final check for quality, security and standards. Never edits           |

Separate agents with separate jobs catch each other's mistakes. The tester never writes the code, and the reviewer never edits it.

## The golden loop

Every feature goes round the same loop. Nothing is done until a test proves it.

1. **Story.** What are we building, for whom, and how will we know it works?
2. **Test first.** The tester writes [tests](/glossary#test) that must fail, because the feature doesn't exist yet.
3. **Build.** The developer writes the smallest change that makes the tests pass.
4. **Check.** Accessibility, content and code review happen at the same time.
5. **You approve.** Try it in the browser, including making a mistake on purpose.

## What happens automatically

Your team has [automatic checks](/glossary#hook) that run without anyone remembering:

- Every time Claude changes something, the related tests run. If one fails, Claude fixes it straight away.
- Before Claude says it's finished, every test runs.
- Passwords and other secrets are off limits. Claude can't open them.

## Team rules

1. Use the tools and accounts your facilitator gives you. Follow the [Defra AI toolkit (opens in new tab)](https://digital.defra.gov.uk/ai-toolkit) guidance.
2. Use made-up information only. Never real people's details.
3. Never put passwords or secrets in your work or your messages to Claude.
4. Your teammates suggest. You decide.
5. A failing test is never "fixed" by making the test easier.
6. Claude never shares your work outside your workspace without you asking.
7. Use GOV.UK's building blocks. Never invent new ones.
8. Read [when Claude asks permission](/claude-permissions) before your first mission.
