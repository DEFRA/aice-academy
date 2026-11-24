# Copy-ready GOV.UK examples

These follow the GOV.UK Design System. Check the Design System website for the latest options.

## Question page with radios and errors

```njk
{% extends 'layouts/page.njk' %}
{% from "govuk/components/radios/macro.njk" import govukRadios %}
{% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %}
{% from "govuk/components/button/macro.njk" import govukButton %}

{% block content %}
<div class="govuk-grid-row">
  <div class="govuk-grid-column-two-thirds">
    {% if errorList %}
      {{ govukErrorSummary({ titleText: "There is a problem", errorList: errorList }) }}
    {% endif %}
    <form method="post" novalidate>
      {{ govukRadios({
        name: "condition",
        fieldset: {
          legend: { text: "Was the hedgehog injured?", isPageHeading: true, classes: "govuk-fieldset__legend--l" }
        },
        errorMessage: errors.condition,
        items: [
          { value: "healthy", text: "No, it looked healthy", checked: answers.condition == "healthy" },
          { value: "injured", text: "Yes, it looked injured", checked: answers.condition == "injured" },
          { value: "unsure", text: "I'm not sure", checked: answers.condition == "unsure" }
        ]
      }) }}
      {{ govukButton({ text: "Continue" }) }}
    </form>
  </div>
</div>
{% endblock %}
```

Check how the template handles CSRF protection on forms and add the token if it is required.

## Date input

```njk
{{ govukDateInput({
  id: "seen-date",
  namePrefix: "seenDate",
  fieldset: { legend: { text: "When did you see the hedgehog?", isPageHeading: true, classes: "govuk-fieldset__legend--l" } },
  hint: { text: "For example, 27 3 2026" },
  errorMessage: errors.seenDate
}) }}
```

## Check answers

```njk
{{ govukSummaryList({
  rows: [
    {
      key: { text: "Where" },
      value: { text: answers.location },
      actions: { items: [{ href: "/location", text: "Change", visuallyHiddenText: "where you saw the hedgehog" }] }
    }
  ]
}) }}
```

## Confirmation

```njk
{{ govukPanel({
  titleText: "Sighting reported",
  html: "Your reference number<br><strong>" + reference + "</strong>"
}) }}
```
