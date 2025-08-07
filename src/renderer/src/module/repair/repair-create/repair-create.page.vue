<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-lg-6">
        <CardWrapper :title="$t(`${PATH_LANG}.basic-info`)" card-class="h-100">
          <AppInput
            v-model="basicInfoData.repair_date"
            type="date"
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
            name=".warranty_period"
            :label="$t(`${PATH_LANG}.form.warranty-duration`)"
            :is-required="false"
            :options="warrantyOptions"
            :error="warrantyErrors.warranty_period"
          />
        </CardWrapper>
      </div>

      <div class="col-lg-6">
        <div class="row g-3">
          <div class="col-12">
            <PaymentTable v-model="paymentData" :errors="paymentErrors" />
          </div>

          <div class="col-12">
            <WarrantyTable v-model="warrantyData" :errors="warrantyErrors" />
          </div>
        </div>
      </div>
    </div>

    <CardWrapper card-class="mt-3" body-class="text-end">
      <AppButton
        button-class="btn-primary btn-lg px-4"
        :title="$t(`${PATH_LANG}.actions.submit`)"
        @click="handleSubmit"
      />
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import AppTextarea from '@renderer/components/form/AppTextarea.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import PaymentTable from './components/repair-create-payment-table.vue'
import WarrantyTable from './components/repair-create-warranty-table.vue'
import { getCurrentDate } from '@renderer/common/utils/date.utils'
import { getOptionsByKey, type ISelectOption } from '@renderer/common/utils/option.util'
import {
  usePaymentValidation,
  useRepairBasicInfoValidation,
  useWarrantyValidation
} from './repair-create.validate'
import type { IPayment, IWarranty, IBasicRepairInfo } from './repair-create.type'
import { CONSTANTS } from '@renderer/common/constants'

const PATH_LANG = 'modules.repair.create'

const basicInfoData = ref<IBasicRepairInfo>({ repair_date: getCurrentDate() as string })
const paymentData = ref<IPayment[]>([])
const warrantyData = ref<IWarranty[]>([])
const warrantyOptions = ref<ISelectOption[]>([])

const { errors: basicInfoErrors, validateAll: validateBasicInfo } =
  useRepairBasicInfoValidation(basicInfoData)
const { errors: paymentErrors, validateAll: validatePayment } = usePaymentValidation(paymentData)
const { errors: warrantyErrors, validateAll: validateWarranty } =
  useWarrantyValidation(warrantyData)

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
  if (isValid) {
    //
  }
}

onMounted(async () => {
  warrantyOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.WARRANTY_TYPE)
})
</script>

<style lang="scss" scoped></style>
