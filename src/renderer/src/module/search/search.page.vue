<template>
  <div class="container-fluid py-3">
    <SearchWrapper :title="$t(`${PATH_LANG}.search.title`)" class="mb-3" @on-search="onSearch">
      <div class="row g-3">
        <div class="col-md-6">
          <AppInput
            v-model="searchData.customerSearch"
            type="text"
            name="customerSearch"
            :label="$t(`${PATH_LANG}.search.customer-label`)"
            :placeholder="$t(`${PATH_LANG}.search.customer-placeholder`)"
            :has-margin="false"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">{{ $t(`${PATH_LANG}.search.date-range`) }}</label>
          <div class="d-flex align-items-center gap-2">
            <input
              v-model="searchData.startDate"
              type="date"
              class="form-control"
              name="startDate"
            />
            <span class="text-muted">~</span>
            <input v-model="searchData.endDate" type="date" class="form-control" name="endDate" />
          </div>
        </div>
      </div>

      <template #extra-buttons>
        <AppButton :title="$t(`${PATH_LANG}.search.export`)" @click="handleExport" />
      </template>
    </SearchWrapper>

    <Table key-loading="REPAIR_SEARCH_RESULT" :headers="TABLE_HEADERS" :data="[]">
      <template #cell-actions="">
        <div class="d-flex justify-content-center gap-2"></div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import SearchWrapper from '@renderer/components/wrapper/SearchWrapper.vue'
import Table from '@renderer/components/table/Table.vue'
import { useSearchStore } from './search.store'
import type { ITableHeader } from '@renderer/components/table/table.tyle'

const { t } = useI18n()
const PATH_LANG = 'search'

const { handleSearch } = useSearchStore()

const searchData = ref({
  customerSearch: '',
  startDate: '',
  endDate: ''
})

const TABLE_HEADERS: ITableHeader[] = [
  {
    label: t(`${PATH_LANG}.results.table.no`),
    key: 'no',
    width: 50,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.repair-date`),
    key: 'repairDate',
    width: 80,
    align: 'left'
  },
  {
    label: t(`${PATH_LANG}.results.table.description`),
    key: 'description',
    width: 200,
    align: 'left'
  },
  {
    label: t(`${PATH_LANG}.results.table.technician`),
    key: 'technician',
    width: 120,
    align: 'left'
  },
  {
    label: t(`${PATH_LANG}.results.table.amount`),
    key: 'amount',
    width: 80,
    align: 'right'
  },
  {
    label: t(`${PATH_LANG}.results.table.payment-status`),
    key: 'paymentStatus',
    width: 80,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.warranty`),
    key: 'warranty',
    width: 80,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.actions`),
    key: '',
    width: 100,
    align: 'center',
    sticky: true
  }
]

const handleExport = (): void => {}

const onSearch = () => {
  handleSearch()
}
</script>

<style lang="scss" scoped></style>
