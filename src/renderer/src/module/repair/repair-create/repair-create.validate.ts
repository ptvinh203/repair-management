import { useI18n } from 'vue-i18n'
import { maxLength, numeric, required } from '@vuelidate/validators'
import { useListValidation, useValidation } from '@renderer/common/hook/validation/useValidation'
import { type Ref } from 'vue'
import type { TValidationMessages } from '@renderer/common/hook/validation/validation.type'
import type { IBasicRepairInfo, IPayment, IWarranty } from './repair-create.type'

export const useRepairBasicInfoValidation = (formData: Ref<IBasicRepairInfo>) => {
  const { t } = useI18n()
  const PATH_LANG = 'modules.repair.create'

  const messages: TValidationMessages = [
    {
      field: 'repair_date',
      fieldName: t(`${PATH_LANG}.form.repair-date`)
    },
    {
      field: 'customer_phone',
      fieldName: t(`${PATH_LANG}.form.customer-phone`)
    },
    {
      field: 'description',
      fieldName: t(`${PATH_LANG}.form.description`)
    },
    {
      field: 'cost',
      fieldName: t(`${PATH_LANG}.form.amount`)
    }
  ]

  const rules = {
    repair_date: {
      required
    },
    customer_phone: {
      required,
      maxLength: maxLength(20)
    },
    description: {
      required,
      maxLength: maxLength(1000)
    },
    cost: {
      required,
      numeric
    }
  }

  return useValidation(formData, rules, messages)
}

export const usePaymentValidation = (formData: Ref<IPayment[]>) => {
  const { t } = useI18n()
  const PATH_LANG = 'modules.repair.create'

  const messages: TValidationMessages = [
    {
      field: 'payment_date',
      fieldName: t(`${PATH_LANG}.payment.date`)
    },
    {
      field: 'payment_method',
      fieldName: t(`${PATH_LANG}.payment.method`)
    },
    {
      field: 'payment_amount',
      fieldName: t(`${PATH_LANG}.payment.amount`)
    }
  ]

  const rules = {
    payment_date: {
      required
    },
    payment_method: {
      required
    },
    payment_amount: {
      required,
      numeric
    }
  }

  return useListValidation(formData, rules, messages)
}

export const useWarrantyValidation = (formData: Ref<IWarranty[]>) => {
  const { t } = useI18n()
  const PATH_LANG = 'modules.repair.create'

  const messages: TValidationMessages = [
    {
      field: 'warranty_date',
      fieldName: t(`${PATH_LANG}.warranty.date`)
    },
    {
      field: 'description',
      fieldName: t(`${PATH_LANG}.warranty.content`)
    }
  ]

  const rules = {
    warranty_date: {
      required
    }
  }

  return useListValidation(formData, rules, messages)
}
