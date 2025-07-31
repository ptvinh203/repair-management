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
        <tr v-for="(warranty, index) in formaData" :key="warranty.key">
          <td>
            <AppInput
              v-model="warranty.warranty_date"
              type="date"
              :label="t(`${PATH_LANG}.warranty.date`)"
              :is-show-label="false"
              :has-margin="false"
            />
          </td>
          <td>
            <AppInput
              v-model="warranty.description"
              type="text"
              :label="t(`${PATH_LANG}.warranty.content`)"
              :is-show-label="false"
              :has-margin="false"
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
import type { ITableHeader } from '@renderer/components/table/table.tyle'
import type { IWarranty } from '../repair-create.type'

const props = defineProps<{
  modelValue: IWarranty[]
  errors?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IWarranty[]]
}>()

const { t } = useI18n()

const PATH_LANG = 'modules.repair.create'
const TABLE_HEADERS: ITableHeader[] = [
  {
    key: 'payment_date',
    label: t(`${PATH_LANG}.warranty.date`),
    width: 100
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

const formaData = ref<IWarranty[]>([...props.modelValue])

const handleAddWarranty = () => {
  formaData.value.push({ key: Date.now().toString() } as IWarranty)
}

const handleRemoveWarranty = (index: number) => {
  formaData.value.splice(index, 1)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(formaData.value)) {
      formaData.value = [...newValue]
    }
  }
)

watch(
  () => formaData.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true }
)
</script>
