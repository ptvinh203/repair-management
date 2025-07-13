<template>
  <div class="container-fluid py-3">
    <SearchWrapper
      :title="$t('dashboard.search.title')"
      class="mb-3"
      :extra-buttons="extraSearchButtons"
      @on-search="handleSearch"
    >
      <div class="row g-3">
        <div class="col-md-6">
          <AppInput
            v-model="searchData.customerSearch"
            type="text"
            name="customerSearch"
            :label="$t('dashboard.search.customerLabel')"
            :placeholder="$t('dashboard.search.customerPlaceholder')"
            :has-margin="false"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">{{ $t('dashboard.search.dateRange') }}</label>
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
    </SearchWrapper>

    <div>
      <CardWrapper
        :title="$t('dashboard.results.title')"
        body-class="p-0"
        header-class="d-flex justify-content-between align-items-center"
      >
        <template #default>
          <div class="table-responsive">
            <table id="resultsTable" class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col">{{ $t('dashboard.results.table.no') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.repairDate') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.description') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.technician') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.amount') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.paymentStatus') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.warranty') }}</th>
                  <th scope="col">{{ $t('dashboard.results.table.actions') }}</th>
                </tr>
              </thead>
              <tbody id="resultsTableBody"></tbody>
            </table>
          </div>

          <div id="noResults" class="d-none p-4 text-center">
            <p class="text-muted mb-0">{{ $t('dashboard.results.noResults') }}</p>
          </div>
        </template>
      </CardWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import AppButton from '@renderer/components/form/AppButton.vue'
import AppInput from '@renderer/components/form/AppInput.vue'
import SearchWrapper from '@renderer/components/wrapper/SearchWrapper.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchData = ref({
  customerSearch: '',
  startDate: '',
  endDate: ''
})

const handleExport = (): void => {
  console.log('Export clicked')
}

const extraSearchButtons = [
  h(AppButton, {
    title: t('dashboard.search.export'),
    onClick: handleExport
  })
]

const handleSearch = (): void => {
  console.log('Search clicked with data:', searchData.value)
}
</script>

<style lang="scss" scoped></style>
