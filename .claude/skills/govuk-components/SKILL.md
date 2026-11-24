---
name: govuk-components
description: Which GOV.UK Design System components and patterns to use and how to call their Nunjucks macros. Use when designing or building any page.
user-invocable: false
---

# GOV.UK components and patterns

Use the GOV.UK Design System. Never write custom HTML or CSS for something a component already does.

## Before you add a macro

Check `src/server/common/templates/layouts/page.njk` and the existing views to see which macros are already imported. If one is missing, import it at the top of the view:

```njk
{% from "govuk/components/radios/macro.njk" import govukRadios %}
```

## Pick the right component

| You need to...                       | Use                                              |
| ------------------------------------ | ------------------------------------------------ |
| Ask for a short piece of text        | `govukInput`                                     |
| Ask for longer text                  | `govukTextarea` or `govukCharacterCount`         |
| Ask for one choice from a short list | `govukRadios`                                    |
| Ask for several choices              | `govukCheckboxes`                                |
| Ask for a date                       | `govukDateInput`                                 |
| Show what went wrong                 | `govukErrorSummary` + the field's `errorMessage` |
| Let people go back                   | `govukBackLink`                                  |
| Submit a page                        | `govukButton`                                    |
| Show answers to check                | `govukSummaryList`                               |
| Confirm it worked                    | `govukPanel`                                     |
| Say it's a new service               | `govukPhaseBanner`                               |

## Patterns for this service

- **Start page**: H1, what the service is for, what you need, a green start button.
- **Question pages**: one question per page. The question is the page heading, set as the label or legend with `isPageHeading: true`.
- **Check answers**: `govukSummaryList` with a "Change" link for each answer.
- **Confirmation**: `govukPanel` with the reference number, then "What happens next".

More detail and copy-ready examples are in [reference.md](reference.md).
