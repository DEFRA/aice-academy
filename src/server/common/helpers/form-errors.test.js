import { buildFormErrors } from './form-errors.js'

describe('#buildFormErrors', () => {
  test('Should build an error summary list and field errors', () => {
    expect(
      buildFormErrors([
        { path: ['profession'], message: 'Select your profession' }
      ])
    ).toEqual({
      errorList: [{ text: 'Select your profession', href: '#profession' }],
      fieldErrors: { profession: { text: 'Select your profession' } }
    })
  })

  test('Should keep only the first error for each field', () => {
    const { errorList } = buildFormErrors([
      { path: ['reflection'], message: 'First' },
      { path: ['reflection'], message: 'Second' }
    ])

    expect(errorList).toEqual([{ text: 'First', href: '#reflection' }])
  })

  test('Should return no errors when there are none', () => {
    expect(buildFormErrors()).toEqual({ errorList: [], fieldErrors: {} })
  })
})
