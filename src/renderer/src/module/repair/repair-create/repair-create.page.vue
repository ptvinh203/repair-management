<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <Loading key-loading="REPAIR_CREATE_FORM" />
      <div class="col-lg-6">
        <CardWrapper :title="$t(`${PATH_LANG}.basic-info`)" card-class="h-100">
          <AppInput
            v-model="basicInfoData.repair_date"
            type="datetime-local"
            :label="$t(`${PATH_LANG}.form.repair-date`)"
            :is-required="true"
            :error="basicInfoErrors.repair_date"
          />
          <AppInput
            v-model="basicInfoData.customer_phone"
            type="text"
            name="customer_phone"
            :label="$t(`${PATH_LANG}.form.customer-phone`)"
            :is-required="true"
            :max-length="20"
            :error="basicInfoErrors.customer_phone"
          />
          <AppTextarea
            v-model="basicInfoData.description"
            name="repairDescription"
            :label="$t(`${PATH_LANG}.form.description`)"
            :is-required="true"
            :rows="2"
            :max-length="1000"
            :error="basicInfoErrors.description"
          />
          <AppInput
            v-model="basicInfoData.cost"
            type="number"
            name="cost"
            min="0"
            step="1000"
            :label="$t(`${PATH_LANG}.form.amount`)"
            :is-required="true"
            :error="basicInfoErrors.cost"
          />
          <AppSelect
            v-model="basicInfoData.warranty_period"
            name="warranty_period"
            :label="$t(`${PATH_LANG}.form.warranty-duration`)"
            :is-required="false"
            :options="warrantyOptions"
            :error="warrantyErrorMsg"
          />
        </CardWrapper>
      </div>

      <div class="col-lg-6">
        <div class="row g-3">
          <div class="col-12">
            <PaymentTable v-model="paymentData" :errors="paymentErrors" />
          </div>

          <div class="col-12">
            <WarrantyTable
              v-model="warrantyData"
              :repair-date="basicInfoData.repair_date"
              :warranty-period="
                basicInfoData.warranty_period
                  ? Number(getExtraByCd(warrantyOptions, basicInfoData.warranty_period, 1))
                  : undefined
              "
              :errors="warrantyErrors"
              @check-valid="
                (isValid) => {
                  isWarrantiesValid = isValid
                }
              "
            />
          </div>
        </div>
      </div>
    </div>

    <CardWrapper card-class="mt-2" body-class="px-3 py-2 text-end">
      <AppButton
        button-class="btn-primary"
        :title="$t(`${PATH_LANG}.actions.submit`)"
        @click="handleSubmit"
      />
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import PaymentTable from './components/repair-create-payment-table.vue'
import WarrantyTable from './components/repair-create-warranty-table.vue'
import Loading from '@renderer/components/loading/Loading.vue'
import { CONSTANTS } from '@renderer/common/constants'
import { getCurrentDatePicker } from '@renderer/common/utils/date.utils'
import {
  getExtraByCd,
  getOptionsByKey,
  type ISelectOption
} from '@renderer/common/utils/option.util'
import {
  usePaymentValidation,
  useRepairBasicInfoValidation,
  useWarrantyValidation
} from './repair-create.validate'
import type { IPayment, IWarranty, IBasicRepairInfo } from './repair-create.type'
import { useRepairStore } from './repair-create.store'
import { showSuccessToast } from '@renderer/components/toast'

const { t } = useI18n()
const PATH_LANG = 'modules.repair.create'

const basicInfoData = ref<IBasicRepairInfo>({
  repair_date: getCurrentDatePicker('datetime-local') as string
})
const paymentData = ref<IPayment[]>([])
const warrantyData = ref<IWarranty[]>([])
const warrantyOptions = ref<ISelectOption[]>([])
const warrantyErrorMsg = ref<string>('')
const isWarrantiesValid = ref<boolean>(true)

const { isSuccess, createRepair } = useRepairStore()

const {
  errors: basicInfoErrors,
  validateAll: validateBasicInfo,
  resetErrors: resetBasicInfoErrors
} = useRepairBasicInfoValidation(basicInfoData)
const {
  errors: paymentErrors,
  validateAll: validatePayment,
  resetErrors: resetPaymentErrors
} = usePaymentValidation(paymentData)
const {
  errors: warrantyErrors,
  validateAll: validateWarranty,
  resetErrors: resetWarrantyErrors
} = useWarrantyValidation(warrantyData)

const validateAll = async () => {
  paymentData.value = paymentData.value.filter((payment) => {
    const { payment_amount, payment_date, payment_method } = payment

    return !!payment_amount || !!payment_date || !!payment_method
  })

  warrantyData.value = warrantyData.value.filter((warranty) => {
    const { warranty_date, description: warranty_description } = warranty

    return !!warranty_date || !!warranty_description
  })

  const basicInfoValid = await validateBasicInfo()
  const paymentValid = await validatePayment()
  const warrantyValid = await validateWarranty()

  return basicInfoValid && paymentValid && warrantyValid
}

const handleSubmit = async () => {
  const isValid = await validateAll()
  if (isValid && isWarrantiesValid.value) {
    const isWarrantyValid =
      (warrantyData.value.length > 0 && basicInfoData.value.warranty_period !== undefined) ||
      !warrantyData.value.length
    if (!isWarrantyValid) {
      warrantyErrorMsg.value = t('errors.ERR00000003')

      return
    }

    await createRepair({
      basicInfo: basicInfoData.value,
      payments: paymentData.value,
      warranties: warrantyData.value
    })
  }
}

watch(
  () => basicInfoData.value.warranty_period,
  (newValue) => {
    if (!!newValue) {
      warrantyErrorMsg.value = ''
    }
  }
)

watch(
  () => isSuccess.value,
  (newValue) => {
    if (newValue) {
      showSuccessToast(t(`${PATH_LANG}.create-success-message`))
      basicInfoData.value = { repair_date: getCurrentDatePicker('datetime-local') as string }
      paymentData.value = []
      warrantyData.value = []
      resetBasicInfoErrors()
      resetPaymentErrors()
      resetWarrantyErrors()
    }
  }
)

onMounted(async () => {
  warrantyOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.WARRANTY_TYPE)
})
</script>

<style lang="scss" scoped></style>
