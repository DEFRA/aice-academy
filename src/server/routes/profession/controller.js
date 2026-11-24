import Joi from 'joi'

import { statusCodes } from '#/server/common/constants/status-codes.js'
import {
  getProfession,
  getProfessions
} from '#/server/common/helpers/content/content.js'
import { buildFormErrors } from '#/server/common/helpers/form-errors.js'
import { getProgress, setProfession } from '#/server/common/helpers/progress.js'

const professionError = 'Select your profession'

export function professionViewModel(selected, errors = {}) {
  const hasErrors = Boolean(errors.errorList?.length)

  return {
    pageTitle: `${hasErrors ? 'Error: ' : ''}What's your profession?`,
    errorList: errors.errorList,
    profession: {
      idPrefix: 'profession',
      name: 'profession',
      fieldset: {
        legend: {
          text: "What's your profession?",
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text: 'Everyone does the same missions. Your profession decides where you lead and your stretch challenges. You can change it later.'
      },
      errorMessage: errors.fieldErrors?.profession,
      items: getProfessions().map(({ id, name }) => ({
        value: id,
        text: name,
        checked: id === selected
      }))
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
