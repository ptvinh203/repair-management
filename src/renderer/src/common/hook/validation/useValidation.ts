import useVuelidate from '@vuelidate/core'
import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TFormData, TValidationMessages } from './validation.type'

/**
 * A custom Vue composition hook for form validation using Vuelidate
 *
 * This hook provides a comprehensive validation solution with internationalization support,
 * custom error messages, and automatic error handling for common validation rules.
 *
 * @param {Ref<TFormData>} formData - A reactive reference to the form data object
 * @param {Record<string, any>} rules - Validation rules object where keys are field names and values are validation functions
 * @param {TValidationMessages} [messages] - Optional custom validation messages for specific fields
 *
 * @returns {Object} Validation utilities and state
 * @returns {Object} returns.$v - Vuelidate instance with validation state and methods
 * @returns {ComputedRef<boolean>} returns.isValid - Computed boolean indicating if the form is valid
 * @returns {ComputedRef<Record<string, string>>} returns.errors - Computed object containing field-specific error messages
 * @returns {Function} returns.validateAll - Async function to trigger validation on all fields
 */
export const useValidation = (
  formData: Ref<TFormData>,
  rules: Record<string, any>,
  messages?: TValidationMessages
) => {
  const { t } = useI18n()
  const v$ = useVuelidate(rules, formData)

  /**
   * Computed property that generates error messages for invalid form fields
   *
   * @returns {Record<string, string>} Object with field names as keys and error messages as values
   */
  const errors = computed(() => {
    const errorList: Record<string, string> = {}

    for (const field in v$.value) {
      const fieldValidation = v$.value[field]
      if (!fieldValidation?.$invalid || !fieldValidation?.$dirty) continue

      const fieldMsg = messages?.find((m) => m.field === field)

      if (fieldMsg?.message) {
        errorList[field] = fieldMsg.message
        continue
      }

      const firstError = fieldValidation?.$errors?.[0]
      if (!firstError) continue

      const validator = firstError.$validator
      const params = firstError.$params

      let defaultMsg = ''
      const fieldName = fieldMsg?.fieldName || field

      switch (validator) {
        case 'required':
          defaultMsg = t('validation.required', { field: fieldName })
          break
        case 'email':
          defaultMsg = t('validation.email', { field: fieldName })
          break
        case 'numeric':
          defaultMsg = t('validation.numeric', { field: fieldName })
          break
        case 'minLength':
          defaultMsg = t('validation.minLength', { field: fieldName, length: params.min })
          break
        case 'maxLength':
          defaultMsg = t('validation.maxLength', { field: fieldName, length: params.max })
          break
        case 'regex':
          defaultMsg = t('validation.invalidFormat', { field: fieldName })
          break
        default:
          defaultMsg = t('validation.invalidFormat', { field: fieldName })
      }

      errorList[field] = defaultMsg
    }

    return errorList
  })

  /**
   * Computed property that indicates whether the entire form is valid
   *
   * @returns {boolean} True if all form fields are valid, false otherwise
   */
  const isValid = computed(() => !v$.value.$invalid)

  /**
   * Validates all form fields and triggers error display
   *
   * This method marks all fields as "touched" (dirty) and runs validation.
   * Use this method when submitting the form or when you want to show
   * validation errors for all fields at once.
   *
   * @returns {Promise<boolean>} Promise that resolves to true if form is valid, false otherwise
   */
  const validateAll = async () => {
    v$.value.$touch()
    await v$.value.$validate()

    return !v$.value.$invalid
  }

  /**
   * Resets the validation state of the form
   */
  const resetErrors = () => {
    v$.value.$reset()
  }

  return {
    $v: v$,
    isValid,
    errors,
    validateAll,
    resetErrors
  }
}
