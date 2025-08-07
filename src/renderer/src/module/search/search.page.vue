<template>
  <div class="container-fluid py-3">
    <SearchWrapper
      wrapper-class="mb-3"
      :title="$t(`${PATH_LANG}.search.title`)"
      @on-search="onSearch"
    >
      <div class="row g-3">
        <div class="col-lg-6 col-md-6">
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
      </div>

      <template #extra-buttons>
        <AppButton :title="$t(`${PATH_LANG}.search.export`)" @click="handleExport" />
      </template>
    </SearchWrapper>

    <CardWrapper body-class="p-0" :max-height="tableMaxHeight">
      <Table key-loading="REPAIR_SEARCH_RESULT" :headers="TABLE_HEADERS" :data="[]"> </Table>
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import SearchWrapper from '@renderer/components/wrapper/SearchWrapper.vue'
import Table from '@renderer/components/table/Table.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import { getIndexTableHeader } from '@renderer/common/utils/table.util'
import { useTableMaxHeight } from '@renderer/common/hook/height/useTableMaxHeight'
import { useSearchStore } from './search.store'
import type { ITableHeader } from '@renderer/components/table/table.tyle'
import type { ISearchPayload, ISearchResponse } from './search.type'

const { t } = useI18n()
const PATH_LANG = 'modules.search'

const { maxHeight: tableMaxHeight } = useTableMaxHeight([
  '.navbar',
  '.search-wrapper',
  '.card-header'
])
const { handleSearch } = useSearchStore()

const searchData = ref<ISearchPayload>({} as ISearchPayload)
const searchResult = ref<ISearchResponse[]>([])

const TABLE_HEADERS: ITableHeader[] = [
  getIndexTableHeader(),
  {
    label: t(`${PATH_LANG}.results.table.repair-date`),
    key: 'repairDate',
    width: 100,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.results.table.description`),
    key: 'description',
    width: 200,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.results.table.technician`),
    key: 'technician',
    width: 120,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.results.table.amount`),
    key: 'amount',
    width: 100,
    align: 'end'
  },
  {
    label: t(`${PATH_LANG}.results.table.payment-status`),
    key: 'paymentStatus',
    width: 100,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.warranty`),
    key: 'warranty',
    width: 100,
    align: 'center'
  },
  {
    label: t(`${PATH_LANG}.results.table.actions`),
    key: '',
    width: 150,
    isSticky: true
  }
]

const handleExport = (): void => {}

const onSearch = async () => {
  const response = await handleSearch(searchData.value)
  searchResult.value = response.data as ISearchResponse[]
}
</script>

<style lang="scss" scoped></style>
