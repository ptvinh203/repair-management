<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-lg-6">
        <CustomerUpdatePage
          v-if="isEdit && selectedCustomer"
          :customer="selectedCustomer"
          @updated="fetchData"
          @cancel="resetSelectedCustomer"
        />
        <CustomerCreatePage v-else @created="fetchData" />
      </div>
      <div class="col-lg-6">
        <CardWrapper
          body-class="p-0"
          :title="$t(`${PATH_LANG}.table.title`)"
          :max-height="tableMaxHeight"
        >
          <Table
            key-loading="CUSTOMER_TABLE"
            :headers="TABLE_HEADERS"
            :data="customers"
            :hightlighted-row="selectedCustomerIndex"
          >
            <template #cell:index="{ index }"> {{ index + 1 }} </template>
            <template #cell:actions="{ row, index }">
              <div class="d-flex justify-content-center gap-2">
                <AppButton
                  button-class="btn-primary btn-sm"
                  :title="$t(`common.btn-edit`)"
                  @click="handleEdit(row, index)"
                />
                <AppButton
                  button-class="btn-danger btn-sm"
                  :title="$t(`common.btn-delete`)"
                  @click="handleDelete(row)"
                />
              </div>
            </template>
          </Table>
        </CardWrapper>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@renderer/components/form/AppButton.vue'
import CardWrapper from '@renderer/components/wrapper/CardWrapper.vue'
import CustomerCreatePage from '@renderer/module/customer/customer-create/customer-create.page.vue'
import CustomerUpdatePage from '@renderer/module/customer/customer-update/customer-update.page.vue'
import Table from '@renderer/components/table/Table.vue'
import { getIndexTableHeader } from '@renderer/common/utils/table.util'
import { showDeleteConfirmModal } from '@renderer/components/modal'
import { useTableMaxHeight } from '@renderer/common/hook/height/useTableMaxHeight'
import { useCustomerStore } from './customer.store'
import { showSuccessToast } from '@renderer/components/toast'
import type { ITableData, ITableHeader } from '@renderer/components/table/table.tyle'
import type { ICustomer } from './customer.type'

const { t } = useI18n()
const { maxHeight: tableMaxHeight } = useTableMaxHeight()

const { isSuccess, getCustomers, deleteCustomer } = useCustomerStore()

const PATH_LANG = 'modules.customer'
const TABLE_HEADERS: ITableHeader[] = [
  getIndexTableHeader(),
  {
    label: t(`${PATH_LANG}.table.name`),
    key: 'name',
    isSortable: true,
    width: 250,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.table.phone`),
    key: 'phone',
    isSortable: true,
    width: 120,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.table.address`),
    key: 'address',
    width: 300,
    align: 'start'
  },
  {
    label: t(`${PATH_LANG}.table.actions`),
    key: 'actions',
    width: 150,
    isSticky: true
  }
]

const customers = ref([] as ICustomer[])
const isEdit = ref<boolean>(false)
const selectedCustomer = ref<ICustomer | null>(null)
const selectedCustomerIndex = ref<number>(-1)

const resetSelectedCustomer = () => {
  selectedCustomer.value = null
  isEdit.value = false
  selectedCustomerIndex.value = -1
}

const fetchData = async () => {
  resetSelectedCustomer()
  customers.value = await getCustomers()
}

const handleEdit = (customer: ITableData, index: number) => {
  selectedCustomer.value = customer as ICustomer
  isEdit.value = true
  selectedCustomerIndex.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleDelete = async (customer: ITableData) => {
  const confirmed = await showDeleteConfirmModal()
  if (confirmed) {
    await deleteCustomer(customer.id)
  }
}

watch(
  () => isSuccess.value,
  (newValue) => {
    if (newValue) {
      showSuccessToast(t(`${PATH_LANG}.delete-success`))
      fetchData()
    }
  }
)

onMounted(() => {
  fetchData()
})
</script>
