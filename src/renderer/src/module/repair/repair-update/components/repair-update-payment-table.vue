<template>
  <CardWrapper
    body-class="p-0"
    :title="$t(`${PATH_LANG}.payment.title`)"
    :is-show-action-button="true"
    @action-button-clicked="handleAddPayment"
  >
    <Table :headers="TABLE_HEADERS" :data="[]" :is-only-header="true" :max-height="330">
      <tbody>
        <tr v-for="(payment, index) in formaData" :key="payment.key">
          <td>
            <AppInput
              v-model="payment.payment_date"
              type="datetime-local"
              :label="t(`${PATH_LANG}.payment.date`)"
              :is-show-label="false"
              :has-margin="false"
              :error="errors[`${index}.payment_date`]"
            />
          </td>
          <td>
            <AppSelect
              v-model="payment.payment_method"
              :label="t(`${PATH_LANG}.payment.method`)"
              :options="paymentMethodOptions"
              :is-show-label="false"
              :has-margin="false"
              :error="errors[`${index}.payment_method`]"
            />
          </td>
          <td>
            <AppInput
              v-model="payment.payment_amount"
              type="number"
              :label="t(`${PATH_LANG}.payment.amount`)"
              :is-show-label="false"
              :has-margin="false"
              :error="errors[`${index}.payment_amount`]"
            />
          </td>
          <td class="text-center">
            <AppButton
              button-class="btn-outline-danger"
              :title="$t(`${PATH_LANG}.payment.remove`)"
              @click="handleRemovePayment(index)"
            />
          </td>
        </tr>
      </tbody>
    </Table>
  </CardWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import Table from '@renderer/components/table/Table.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import { CONSTANTS } from '@renderer/common/constants'
import { getOptionsByKey } from '@renderer/common/utils/option.util'
import { getCurrentDatePicker } from '@renderer/common/utils/date.utils'
import type { ISelectOption } from '@renderer/common/utils/option.util'
import type { ITableHeader } from '@renderer/components/table/table.tyle'
import type { IPayment } from '../repair-update.type'

const props = defineProps<{
  modelValue: IPayment[]
  errors?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IPayment[]]
}>()

const { t } = useI18n()

const PATH_LANG = 'modules.repair.update'
const TABLE_HEADERS: ITableHeader[] = [
  {
    key: 'payment_date',
    label: t(`${PATH_LANG}.payment.date`),
    width: 120
  },
  {
    key: 'payment_method',
    label: t(`${PATH_LANG}.payment.method`),
    width: 100
  },
  {
    key: 'amount',
    label: t(`${PATH_LANG}.payment.amount`),
    width: 100
  },
  {
    key: 'actions',
    label: t(`${PATH_LANG}.payment.actions`),
    width: 40
  }
]

const formaData = ref<IPayment[]>([...props.modelValue])
const paymentMethodOptions = ref<ISelectOption[]>([])

const handleAddPayment = () => {
  formaData.value.push({
    key: Date.now().toString(),
    payment_date: getCurrentDatePicker('datetime-local')
  } as IPayment)
}

const handleRemovePayment = (index: number) => {
  formaData.value.splice(index, 1)
}

watch(
  () => props.modelValue,
  (newValue) => {
    const newValueTmp = newValue.map((e) => ({ ...e, key: undefined }))
    const formDataTmp = formaData.value.map((e) => ({ ...e, key: undefined }))

    if (JSON.stringify(newValueTmp) !== JSON.stringify(formDataTmp)) {
      formaData.value = [...newValue]
    }
  },
  { deep: true }
)

watch(
  () => formaData.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true }
)

onMounted(async () => {
  paymentMethodOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.PAYMENT_METHOD)
})
</script>
