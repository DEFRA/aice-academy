---
name: quality-gate
description: Runs a full quality sweep of the whole service - tests, lint, accessibility, content and code review - and produces one report. Use before show and tell or any deployment.
disable-model-invocation: true
---

# Quality gate

1. Run `npm test` and `npm run lint`. Record the results.
2. In parallel, ask:
   - the **accessibility-auditor** agent to audit every page in the journey
   - the **content-designer** agent to check every page for GOV.UK style and consistent words
   - the **reviewer** agent to review the whole codebase against the `cdp-conventions` skill and the backlog
3. Check the service against these GOV.UK Service Standard points and give each a rating (Met, Partly met, Not met) with one line of evidence:
   - 1. Understand users and their needs
   - 4. Make the service simple to use
   - 5. Make sure everyone can use the service
   - 9. Create a secure service which protects users' privacy
   - 10. Define what success looks like
   - 14. Operate a reliable service
4. Write `quality-report.md` with:
   - a traffic-light summary at the top
   - Must fix items, then Should fix, then Nice to have
   - the manual checks a person still needs to do
5. Tell the service owner the headline in two sentences.
