import useVuelidate, { type Validation } from '@vuelidate/core'
import { computed, ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TFormData, TFormListData, TRule, TValidationMessages } from './validation.type'

/**
 * Generates error message for a validation error
 */
const generateErrorMessage = (
  t: (key: string, params?: Record<string, any>) => string,
  validator: string,
  params: Record<string, any>,
  fieldName: string
): string => {
  switch (validator) {
    case 'required':
      return t('validation.required', { field: fieldName })
    case 'email':
      return t('validation.email', { field: fieldName })
    case 'numeric':
      return t('validation.numeric', { field: fieldName })
    case 'minLength':
      return t('validation.minLength', { field: fieldName, length: params.min })
    case 'maxLength':
      return t('validation.maxLength', { field: fieldName, length: params.max })
    case 'regex':
      return t('validation.invalidFormat', { field: fieldName })
    default:
      return t('validation.invalidFormat', { field: fieldName })
  }
}

/**
 * Gets error message for a field validation
 */
const getFieldErrorMessage = (
  fieldValidation: any,
  field: string,
  messages: TValidationMessages | undefined,
  t: (key: string, params?: Record<string, any>) => string
): string | null => {
  if (!fieldValidation?.$invalid || !fieldValidation?.$dirty) return null

  const fieldMsg = messages?.find((m) => m.field === field)
  if (fieldMsg?.message) {
    return fieldMsg.message
  }

  const firstError = fieldValidation?.$errors?.[0]
  if (!firstError) return null

  const validator = firstError.$validator
  const params = firstError.$params || {}
  const fieldName = fieldMsg?.fieldName || field

  return generateErrorMessage(t, validator, params, fieldName)
}

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
 * @returns Validation utilities and state
 */
export const useValidation = (
  formData: Ref<TFormData>,
  rules: TRule,
  messages?: TValidationMessages
) => {
  const { t } = useI18n()
  const v$ = useVuelidate(rules, formData)

  const errors = computed(() => {
    const errorList: Record<string, string> = {}

    for (const field in v$.value) {
      const errorMessage = getFieldErrorMessage(v$.value[field], field, messages, t)
      if (errorMessage) {
        errorList[field] = errorMessage
      }
    }

    return errorList
  })

  const isValid = computed(() => !v$.value.$invalid)

  const validateAll = async (): Promise<boolean> => {
    v$.value.$touch()
    await v$.value.$validate()

    return !v$.value.$invalid
  }

  const resetErrors = (): void => {
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

/**
 * A custom Vue composition hook for list/array form validation using Vuelidate
 *
 * @param {Ref<TFormListData>} formData - A reactive reference to the form list data
 * @param {TRule} rules - Validation rules for the list items
 * @param {TValidationMessages} [messages] - Optional custom validation messages for specific fields
 *
 * @returns Validation utilities and state
 */
export const useListValidation = (
  formData: Ref<TFormListData>,
  rules: TRule,
  messages?: TValidationMessages
) => {
  const { t } = useI18n()
  const v_arr: Ref<Ref<Validation<TRule, Record<string, any>>>[]> = ref([])

  watch(
    () => formData.value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        v_arr.value = newValue.map((item) => useVuelidate(rules, item))
      }
    },
    { deep: true }
  )

  const errors = computed(() => {
    const errorList: Record<string, string> = {}

    v_arr.value.forEach((v$, index) => {
      for (const field in v$.value) {
        const errorMessage = getFieldErrorMessage(v$.value[field], field, messages, t)
        if (errorMessage) {
          errorList[`${index}.${field}`] = errorMessage
        }
      }
    })

    return errorList
  })

  const isValid = computed(() => v_arr.value.every((v$) => !v$.value.$invalid))

  const validateAll = async (): Promise<boolean> => {
    await Promise.all(
      v_arr.value.map((v$) => {
        v$.value.$touch()

        return v$.value.$validate()
      })
    )

    return !v_arr.value.some((v$) => v$.value.$invalid)
  }

  const resetErrors = (): void => {
    v_arr.value.forEach((v$) => {
      v$.value.$reset()
    })
  }

  return {
    $v: v_arr,
    isValid,
    errors,
    validateAll,
    resetErrors
  }
}
