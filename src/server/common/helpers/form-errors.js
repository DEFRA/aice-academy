/**
 * Turns Joi validation details into the shapes GOV.UK components expect:
 * `errorList` for govukErrorSummary and `fieldErrors` for each field's errorMessage.
 * @param {Array<{ path: Array<string|number>, message: string }>} details
 */
export function buildFormErrors(details = []) {
  const fieldErrors = {}

  details.forEach(({ path, message }) => {
    const field = String(path.at(0))
    fieldErrors[field] ??= { text: message }
  })

  const errorList = Object.entries(fieldErrors).map(([field, error]) => ({
    text: error.text,
    href: `#${field}`
  }))

  return { errorList, fieldErrors }
}
