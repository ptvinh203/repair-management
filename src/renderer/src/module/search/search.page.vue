<template>
  <div class="container-fluid py-3">
    <SearchWrapper
      wrapper-class="mb-3"
      :title="$t(`${PATH_LANG}.search.title`)"
      @on-search="onSearch"
    >
      <div class="row g-3">
        <div class="col-lg-3 col-md-3">
          <AppInput
            v-model="searchData.customerNameOrPhone"
            type="text"
            name="customerNameOrPhone"
            :label="$t(`${PATH_LANG}.search.customer-label`)"
            :placeholder="$t(`${PATH_LANG}.search.customer-placeholder`)"
            :has-margin="false"
          />
        </div>
        <div class="col-lg-6 col-md-6">
          <label class="form-label">{{ $t(`${PATH_LANG}.search.date-range`) }}</label>
          <div class="row align-items-center">
            <AppInput
              v-model="searchData.startDate"
              type="date"
              name="startDate"
              wrapper-class="col-md-5"
              :label="''"
              :is-show-label="false"
              :has-margin="false"
            />
            <div class="col-md-1 align-self-center text-center">
              <span class="text-muted">～</span>
            </div>
            <AppInput
              v-model="searchData.endDate"
              type="date"
              name="endDate"
              wrapper-class="col-md-6"
              :label="''"
              :is-show-label="false"
              :has-margin="false"
            />
          </div>
        </div>
        <div class="col-lg-3 col-md-3">
          <AppSelect
            v-model="searchData.paymentStatus"
            name="paymentStatus"
            :label="$t(`${PATH_LANG}.search.payment-status`)"
            :options="paymentStatusOptions"
            :has-margin="false"
          />
        </div>
      </div>

      <template #extra-buttons>
        <AppButton :title="$t(`${PATH_LANG}.search.export`)" @click="handleExport" />
      </template>
    </SearchWrapper>

    <CardWrapper body-class="p-0" :max-height="tableMaxHeight">
      <Table key-loading="REPAIR_SEARCH_RESULT" :headers="TABLE_HEADERS" :data="searchResponse">
        <template #cell:index="{ index }"> {{ index + 1 }} </template>
        <template #cell:repair_cost="{ value }"> {{ formatPrice(value) }} </template>
        <template #cell:payment_status="{ value }">
          {{ getOptionNameByCd(paymentStatusOptions, value) }}
        </template>
        <template #cell:warranty_status="{ value }">
          {{ getOptionNameByCd(warrantyStatusOptions, value) }}
        </template>
        <template #cell:actions="{ row }">
          <div class="d-flex justify-content-center gap-2">
            <AppButton
              button-class="btn-primary btn-sm"
              :title="$t(`common.btn-view-detail`)"
              @click="handleViewDetail(row.id)"
            />
            <AppButton
              button-class="btn-danger btn-sm"
              :title="$t(`common.btn-delete`)"
              @click="handleDelete(row.id)"
            />
          </div>
        </template>
      </Table>
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@renderer/router'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppSelect from '@renderer/components/form/AppSelect.vue'
import SearchWrapper from '@renderer/components/wrapper/SearchWrapper.vue'
import Table from '@renderer/components/table/Table.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import { CONSTANTS } from '@renderer/common/constants'
import { getOptionNameByCd, getOptionsByKey } from '@renderer/common/utils/option.util'
import { getIndexTableHeader } from '@renderer/common/utils/table.util'
import { useTableMaxHeight } from '@renderer/common/hook/height/useTableMaxHeight'
import { useSearchStore } from './search.store'
import { formatPrice } from '@renderer/common/utils/price.utils'
import { showConfirmModal, showDeleteConfirmModal } from '@renderer/components/modal'
import type { ISelectOption } from '@renderer/common/utils/option.util'
import type { ITableHeader } from '@renderer/components/table/table.tyle'
import type { ISearchPayload } from './search.type'
import { showSuccessToast } from '@renderer/components/toast'

const { t } = useI18n()
const PATH_LANG = 'modules.search'

const { maxHeight: tableMaxHeight } = useTableMaxHeight(
  ['.navbar', '.search-wrapper', '.card-header'],
  12
)
const { isSuccess, searchResponse, handleSearch, deleteRepair, exportExcel } = useSearchStore()

const searchData = ref<ISearchPayload>({} as ISearchPayload)
const paymentStatusOptions = ref<ISelectOption[]>([])
const warrantyStatusOptions = ref<ISelectOption[]>([])

const TABLE_HEADERS: ITableHeader[] = [
  getIndexTableHeader(),
  {
    label: t(`${PATH_LANG}.results.table.repair-date`),
    key: 'repair_date',
    width: 150,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.results.table.description`),
    key: 'repair_description',
    width: 250,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.results.table.technician`),
    key: 'customer',
    width: 150,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.results.table.amount`),
    key: 'repair_cost',
    width: 100,
    align: 'end'
  },
  {
    label: t(`${PATH_LANG}.results.table.payment-status`),
    key: 'payment_status',
    width: 100,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.warranty`),
    key: 'warranty_status',
    width: 100,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.actions`),
    key: 'actions',
    width: 120,
    isSticky: true
  }
]

const handleExport = async () => {
  const isConfirmed = await showConfirmModal(t(`${PATH_LANG}.export-excel-confirm-message`))
  if (isConfirmed) {
    const { success } = await exportExcel(searchData.value)
    if (success) {
      showSuccessToast(t(`${PATH_LANG}.export-excel-success-message`))
    }
  }
}

const handleViewDetail = (repairId: number) => {
  router.push({ name: 'repair-update', params: { id: repairId } })
}

const handleDelete = async (repairId: number) => {
  const confirmed = await showDeleteConfirmModal()
  if (confirmed) {
    await deleteRepair(repairId)
  }
}

const onSearch = () => {
  handleSearch(searchData.value)
}

watch(
  () => isSuccess.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue) {
      showSuccessToast(t(`${PATH_LANG}.delete-success-message`))
      onSearch()
    }
  }
)

onMounted(async () => {
  paymentStatusOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.PAYMENT_STATUS)
  warrantyStatusOptions.value = await getOptionsByKey(CONSTANTS.MASTER_KEY.WARRANTY_STATUS)
  onSearch()
})
</script>

<style lang="scss" scoped></style>
