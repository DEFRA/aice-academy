---
name: govuk-content
description: GOV.UK content style for questions, hints, error messages and buttons. Use when writing or checking any words a user will see.
user-invocable: false
---

# GOV.UK content rules (short version)

## Plain English

- Short sentences (under 25 words). Common words. Active voice.
- Say "you". Avoid "please".
- Sentence case for headings and buttons ("Report a sighting", not "Report A Sighting").
- No jargon, acronyms or Latin abbreviations (write "for example", not "e.g.").

## Questions

- Ask exactly what you want: "When did you see the hedgehog?"
- Use hint text only when it genuinely helps.

## Error messages

Say what went wrong and how to fix it. Be specific. Never blame the user.

| Situation           | Message                                                             |
| ------------------- | ------------------------------------------------------------------- |
| Nothing entered     | Enter where you saw the hedgehog                                    |
| Nothing selected    | Select whether the hedgehog was injured                             |
| Date missing a part | Date you saw the hedgehog must include a month                      |
| Date in the future  | Date you saw the hedgehog must be today or in the past              |
| Wrong format        | Enter an email address in the correct format, like name@example.com |

Avoid "invalid", "error", "oops", "please" and "sorry" in error messages.

## Buttons and links

- Buttons say what happens: "Continue", "Send report", "Start now".
- Links say where they go. Never "click here".

## Page titles

The page title should match the H1. The template's layout adds the service name, giving `<H1 text> | Report a hedgehog sighting`. Put `Error: ` in front when the page shows errors.
