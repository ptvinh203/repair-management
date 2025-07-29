<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-lg-6">
        <CustomerCreatePage />
      </div>
      <div class="col-lg-6">
        <CardWrapper :title="$t(`${PATH_LANG}.table.title`)" body-class="p-0">
          <Table :headers="TABLE_HEADERS" :data="[]"> </Table>
        </CardWrapper>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import Table from '@renderer/components/table/Table.vue'
import CustomerCreatePage from '@renderer/module/customer/customer-create/customer-create.page.vue'
import type { ITableHeader } from '@renderer/components/table/table.tyle'

const { t } = useI18n()

const PATH_LANG = 'modules.customer'
const TABLE_HEADERS: ITableHeader[] = [
  {
    label: '#',
    key: '#',
    width: 50
  },
  {
    label: t(`${PATH_LANG}.table.name`),
    key: 'name',
    sortable: true,
    width: 250
  },
  {
    label: t(`${PATH_LANG}.table.phone`),
    key: 'phone',
    sortable: true,
    width: 150
  },
  {
    label: t(`${PATH_LANG}.table.address`),
    key: 'address'
  },
  {
    label: t(`${PATH_LANG}.table.actions`),
    key: 'actions',
    width: 150
  }
]
</script>
