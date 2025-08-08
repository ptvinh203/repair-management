<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <Loading key-loading="REPAIR_UPDATE_FORM" />
      <div class="col-lg-6">
        <CardWrapper :title="$t(`${PATH_LANG}.basic-info`)" card-class="h-100">
          <div class="row">
            <AppInput
              v-model="basicInfoData.repair_date"
              type="datetime-local"
              wrapper-class="col-md-6"
              :label="$t(`${PATH_LANG}.form.repair-date`)"
              :is-required="true"
              :error="basicInfoErrors.repair_date"
            />
            <AppInput
              v-model="basicInfoData.finish_date"
              type="datetime-local"
              wrapper-class="col-md-6"
              :label="$t(`${PATH_LANG}.form.finish-date`)"
              :error="basicInfoErrors.finish_date"
            />
          </div>
          <AppInput
            v-model="basicInfoData.customer_phone"
            type="text"
            name="customer_phone"
            :label="$t(`${PATH_LANG}.form.customer-phone`)"
            :disabled="true"
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
            type="text"
            name="payment_status"
            :model-value="getOptionNameByCd(paymentStatusOptions, basicInfoData.payment_status!)"
            :label="$t(`${PATH_LANG}.form.payment-status`)"
            :disabled="true"
          />
          <div class="row">
            <AppInput
              v-model="basicInfoData.cost"
              type="number"
              name="cost"
              min="0"
              step="1000"
              wrapper-class="col-md-6"
              :label="$t(`${PATH_LANG}.form.amount`)"
              :is-required="true"
              :error="basicInfoErrors.cost"
            />
            <AppInput
              type="text"
              wrapper-class="col-md-6"
              :model-value="formatPrice(basicInfoData.remaining_cost || 0)"
              :disabled="true"
              :label="$t(`${PATH_LANG}.form.remaining-amount`)"
              :error="basicInfoErrors.remaining_cost"
            />
          </div>
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

    <CardWrapper card-class="mt-3" body-class="text-end">
      <AppButton
        button-class="btn-primary btn-lg px-4 me-2"
        :title="$t(`${PATH_LANG}.actions.submit`)"
        @click="handleSubmit"
      />
      <AppButton
        button-class="btn-outline-primary btn-lg px-4"
        :title="$t('common.btn-back')"
        @click="router.back()"
      />
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import router from '@renderer/router'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import PaymentTable from './components/repair-update-payment-table.vue'
import WarrantyTable from './components/repair-update-warranty-table.vue'
import Loading from '@renderer/components/loading/Loading.vue'
import { CONSTANTS } from '@renderer/common/constants'
import { getCurrentDatePicker } from '@renderer/common/utils/date.utils'
import {
  getExtraByCd,
  getOptionNameByCd,
  getOptionsByKey,
  type ISelectOption
} from '@renderer/common/utils/option.util'
import { showSuccessToast } from '@renderer/components/toast'
import { useRepairUpdateStore } from './repair-update.store'
import { formatPrice } from '@renderer/common/utils/price.utils'
import { showConfirmModal } from '@renderer/components/modal'
import {
  usePaymentValidation,
  useRepairBasicInfoValidation,
  useWarrantyValidation
} from './repair-update.validate'
import type { IPayment, IWarranty, IBasicRepairInfo, IRepairUpdateForm } from './repair-update.type'

const { t } = useI18n()
const PATH_LANG = 'modules.repair.update'

const route = useRoute()
const repairId = route.params.id as string

const basicInfoData = ref<IBasicRepairInfo>({})
const paymentData = ref<IPayment[]>([])
const warrantyData = ref<IWarranty[]>([])
const warrantyOptions = ref<ISelectOption[]>([])
const paymentStatusOptions = ref<ISelectOption[]>([])
const warrantyErrorMsg = ref<string>('')
const isWarrantiesValid = ref<boolean>(true)

const { isSuccess, getRepairById, updateRepair } = useRepairUpdateStore()

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

const resetAllErrors = () => {
  resetBasicInfoErrors()
  resetPaymentErrors()
  resetWarrantyErrors()
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

    const isConfirmed = await showConfirmModal()
    if (isConfirmed) {
      await updateRepair(repairId, {
        basicInfo: basicInfoData.value,
        payments: paymentData.value,
        warranties: warrantyData.value
      })
    }
  }
}

watch(
  () => isSuccess.value,
  (newValue) => {
    if (newValue) {
      showSuccessToast(t(`${PATH_LANG}.update-success-message`))
      router.push({ name: 'search' })
    }
  }
)

watch(
  () => basicInfoData.value.warranty_period,
  (newValue) => {
    if (!!newValue) {
      warrantyErrorMsg.value = ''
    }
  }
)

watch(
  [() => basicInfoData.value.cost, () => paymentData.value],
  ([newCost, newPayments]) => {
    const currentPaymentAmount = newPayments.reduce((total, payment) => {
      return total + (payment.payment_amount || 0)
    }, 0)

    basicInfoData.value.remaining_cost = (newCost ?? 0) - currentPaymentAmount
  },
  { deep: true }
)

onMounted(async () => {
  warrantyOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.WARRANTY_TYPE)
  paymentStatusOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.PAYMENT_STATUS)

  const data = (await getRepairById(repairId)) as IRepairUpdateForm
  const { basicInfo, payments, warranties } = data || {}
  basicInfoData.value = basicInfo || {
    repair_date: getCurrentDatePicker('datetime-local') as string
  }
  paymentData.value = payments || []
  warrantyData.value = warranties || []
  resetAllErrors()
})
</script>

<style lang="scss" scoped></style>
