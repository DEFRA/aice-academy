import Joi from 'joi'

import { statusCodes } from '#/server/common/constants/status-codes.js'
import {
  getProfession,
  getProfessions
} from '#/server/common/helpers/content/content.js'
import { buildFormErrors } from '#/server/common/helpers/form-errors.js'
import { getProgress, setProfession } from '#/server/common/helpers/progress.js'

const professionError = "Select the kind of work you do, or I'm not sure"

export function professionViewModel(selected, errors = {}) {
  const hasErrors = Boolean(errors.errorList?.length)

  return {
    pageTitle: `${hasErrors ? 'Error: ' : ''}What kind of work do you do?`,
    errorList: errors.errorList,
    profession: {
      idPrefix: 'profession',
      name: 'profession',
      fieldset: {
        legend: {
          text: 'What kind of work do you do?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: "Everyone does the same missions, and you don't need any technical knowledge. Your answer tailors a few tips for you. You can change it later."
      },
      errorMessage: errors.fieldErrors?.profession,
      items: getProfessions().flatMap(({ id, name, hint }) => {
        const item = {
          value: id,
          text: name,
          hint: { text: hint },
          checked: id === selected
        }

        // Separate "I'm not sure" from the list, as GOV.UK radios do
        return id === 'not-sure' ? [{ divider: 'or' }, item] : [item]
      })
    }
  }
}

export const professionController = {
  handler(request, h) {
    return h.view(
      'profession/index',
      professionViewModel(getProgress(request).profession)
    )
  }
}

export const saveProfessionController = {
  options: {
    validate: {
      payload: Joi.object({
        profession: Joi.string()
          .required()
          .custom((value, helpers) =>
            getProfession(value) ? value : helpers.error('any.only')
          )
          .messages({
            'any.required': professionError,
            'any.only': professionError,
            'string.empty': professionError
          })
      }),
      failAction(_request, h, error) {
        return h
          .view(
            'profession/index',
            professionViewModel(undefined, buildFormErrors(error.details))
          )
          .code(statusCodes.badRequest)
          .takeover()
      }
    }
  },
  handler(request, h) {
    setProfession(request, request.payload.profession)

    return h.redirect('/missions')
  }
}
