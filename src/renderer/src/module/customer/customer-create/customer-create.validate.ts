import { useI18n } from 'vue-i18n'
import { maxLength, required } from '@vuelidate/validators'
import { useValidation } from '@renderer/common/hook/validation/useValidation'
import type { Ref } from 'vue'
import type { ICustomerForm } from './customer-create.type'
import type { TValidationMessages } from '@renderer/common/hook/validation/validation.type'

export const useCustomerCreateValidation = (formData: Ref<ICustomerForm>) => {
  const { t } = useI18n()
  const PATH_LANG = 'modules.customer.create'

  const messages: TValidationMessages = [
    {
      field: 'name',
      fieldName: t(`${PATH_LANG}.form.name`)
    },
    {
      field: 'phone',
      fieldName: t(`${PATH_LANG}.form.phone`)
    },
    {
      field: 'address',
      fieldName: t(`${PATH_LANG}.form.address`)
    }
  ]

  const rules = {
    name: {
      required,
      maxLength: maxLength(100)
    },
    phone: {
      required,
      maxLength: maxLength(20)
    },
    address: {
      maxLength: maxLength(255)
    }
  }

  return useValidation(formData, rules, messages)
}
