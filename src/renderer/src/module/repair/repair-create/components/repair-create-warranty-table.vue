<template>
  <CardWrapper
    body-class="p-0"
    :max-height="330"
    :title="$t(`${PATH_LANG}.warranty.title`)"
    :is-show-action-button="true"
    @action-button-clicked="handleAddWarranty"
  >
    <Table :headers="TABLE_HEADERS" :data="[]" :is-only-header="true">
      <tbody>
        <tr v-for="(warranty, index) in formData" :key="warranty.key">
          <td>
            <AppInput
              v-model="warranty.warranty_date"
              type="datetime-local"
              :label="t(`${PATH_LANG}.warranty.date`)"
              :is-show-label="false"
              :has-margin="false"
              :error="errorsRef[`${index}.warranty_date`]"
            />
          </td>
          <td>
            <AppInput
              v-model="warranty.description"
              type="text"
              :label="t(`${PATH_LANG}.warranty.content`)"
              :is-show-label="false"
              :has-margin="false"
              :max-length="500"
              :error="errorsRef[`${index}.description`]"
            />
          </td>
          <td class="text-center">
            <AppButton
              button-class="btn-outline-danger"
              :title="$t(`${PATH_LANG}.warranty.remove`)"
              @click="handleRemoveWarranty(index)"
            />
          </td>
        </tr>
      </tbody>
    </Table>
  </CardWrapper>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import Table from '@renderer/components/table/Table.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppButton from '@renderer/components/form/AppButton.vue'
import { CONSTANTS } from '@renderer/common/constants'
import { convertStrToDate, getCurrentDatePicker } from '@renderer/common/utils/date.utils'
import { differenceInMonths } from 'date-fns'
import type { ITableHeader } from '@renderer/components/table/table.tyle'
import type { IWarranty } from '../repair-create.type'

const props = defineProps<{
  modelValue: IWarranty[]
  repairDate?: string
  warrantyPeriod?: number
  errors?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IWarranty[]]
  checkValid: [value: boolean]
}>()

const { t } = useI18n()

const PATH_LANG = 'modules.repair.create'
const TABLE_HEADERS: ITableHeader[] = [
  {
    key: 'payment_date',
    label: t(`${PATH_LANG}.warranty.date`),
    width: 120
  },
  {
    key: 'payment_method',
    label: t(`${PATH_LANG}.warranty.content`),
    width: 200
  },
  {
    key: 'actions',
    label: t(`${PATH_LANG}.warranty.actions`),
    width: 40
  }
]

const formData = ref<IWarranty[]>([...props.modelValue])
const repairDateRef = ref<Date | undefined>(
  props.repairDate
    ? (convertStrToDate(props.repairDate, CONSTANTS.DATE_FORMAT.DATETIME_LOCAL) as Date)
    : undefined
)
const errorsRef = ref<{ [key: string]: string }>(props.errors || {})

const handleAddWarranty = () => {
  formData.value.push({
    key: Date.now().toString(),
    warranty_date: getCurrentDatePicker('datetime-local')
  } as IWarranty)
}

const handleRemoveWarranty = (index: number) => {
  formData.value.splice(index, 1)
}

const checkValid = () => {
  if (!repairDateRef.value) {
    emit('checkValid', false)

    return
  }

  let isValid = true
  formData.value.forEach((warranty, index) => {
    if (!warranty.warranty_date) {
      return
    }

    const warrantyDate = convertStrToDate(
      warranty.warranty_date,
      CONSTANTS.DATE_FORMAT.DATETIME_LOCAL
    )

    if (
      !warrantyDate ||
      Math.abs(differenceInMonths(warrantyDate, repairDateRef.value!)) > (props.warrantyPeriod || 0)
    ) {
      errorsRef.value = {
        ...errorsRef.value,
        [`${index}.warranty_date`]: t(`${PATH_LANG}.warranty.invalid-date`)
      }

      isValid = false
    } else {
      delete errorsRef.value[`${index}.warranty_date`]
    }
  })
  emit('checkValid', isValid)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(formData.value)) {
      formData.value = [...newValue]
    }
  }
)

watch(
  () => formData.value,
  (newValue) => {
    emit('update:modelValue', newValue)
    checkValid()
  },
  { deep: true }
)

watch(
  () => props.errors,
  (newValue) => {
    errorsRef.value = { ...errorsRef.value, ...newValue }
  }
)

watch(
  () => props.repairDate,
  (newValue) => {
    repairDateRef.value = newValue
      ? (convertStrToDate(newValue, CONSTANTS.DATE_FORMAT.DATETIME_LOCAL) as Date)
      : undefined
    checkValid()
  }
)

watch(
  () => props.warrantyPeriod,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      checkValid()
    }
  }
)
</script>
