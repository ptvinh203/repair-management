<template>
  <div class="position-relative">
    <Loading :key-loading="keyLoading" />
    <table class="table table-bordered table-hover">
      <thead :style="{ backgroundColor: '#2c3e50' }" class="text-white">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            scope="col"
            :style="{
              width: header.width ? `${header.width}px` : 'auto',
              position: header.sticky ? 'sticky' : 'static',
              right: header.sticky ? '0' : 'auto',
              zIndex: header.sticky ? 10 : 'auto'
            }"
            :class="[
              'text-center align-middle',
              header.sticky ? 'sticky-column' : '',
              header.sortable ? 'sortable-header' : ''
            ]"
            @click="handleSort(header.key, header.sortable)"
          >
            <div class="d-flex align-items-center justify-content-center">
              <span>{{ header.label }}</span>
              <i v-if="header.sortable" :class="getSortIconClass(header.key)" class="ms-2"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!onlyHeader">
        <tr v-if="!data || data.length === 0">
          <td :colspan="headers.length" class="text-left text-muted">
            {{ $t('common.no-search-result') }}
          </td>
        </tr>
        <tr v-for="(row, rowIndex) in data" v-else :key="rowIndex">
          <td
            v-for="header in headers"
            :key="header.key"
            :style="{
              position: header.sticky ? 'sticky' : 'static',
              left: header.sticky ? '0' : 'auto',
              zIndex: header.sticky ? 5 : 'auto'
            }"
            :class="[
              getTextAlignClass(header.align),
              header.sticky ? 'sticky-column bg-white' : ''
            ]"
          >
            <slot :name="`cell-${header.key}`" :row="row" :value="row[header.key]">
              {{ row[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
      <slot v-else></slot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '@renderer/components/loading/Loading.vue'
import type { ITableHeader, ITableData, TTableAlign, TTableSortDirection } from './table.tyle'
import './table.style.scss'

const props = defineProps<{
  headers: ITableHeader[]
  data: ITableData[] | null
  keyLoading?: string
  onlyHeader?: boolean
}>()

const emit = defineEmits<{
  sort: [column: string | null, direction: TTableSortDirection, initial: boolean]
}>()

const route = useRoute()

const sortColumn = ref<string | null>('')
const sortDirection = ref<TTableSortDirection>('asc')

const getStorageKey = (): string => {
  try {
    return `table-sort:${route.path}`
  } catch {
    // Fallback if useRoute() fails
    return `table-sort:${window.location.pathname}`
  }
}

const loadSortState = (): void => {
  const storageKey = getStorageKey()
  const savedState = localStorage.getItem(storageKey)

  if (savedState) {
    const { key, order } = JSON.parse(savedState)

    // Validate that the saved column key exists in current headers
    const headerExists = props.headers.some((header) => header.key === key && header.sortable)

    if (headerExists && (order === 'asc' || order === 'desc')) {
      sortColumn.value = key
      sortDirection.value = order
      emit('sort', sortColumn.value, sortDirection.value, true)
    }
  }
}

const saveSortState = (): void => {
  const storageKey = getStorageKey()

  if (sortColumn.value && sortDirection.value) {
    const state = {
      key: sortColumn.value,
      order: sortDirection.value
    }
    localStorage.setItem(storageKey, JSON.stringify(state))

    return
  }

  localStorage.removeItem(storageKey)
}

const getTextAlignClass = (align?: TTableAlign): string => {
  const alignMap = {
    left: 'text-start',
    right: 'text-end',
    center: 'text-center'
  }

  return (align && alignMap[align]) || 'text-start'
}

const getSortIconClass = (columnKey: string): string => {
  const isSorted = sortColumn.value === columnKey
  const isAsc = sortDirection.value === 'asc'

  return `bi bi-${isSorted ? (!isAsc ? 'arrow-down' : 'arrow-up') : 'arrow-down-up'}`
}

const handleSort = (columnKey: string, sortable?: boolean): void => {
  if (!sortable) return

  if (sortColumn.value === columnKey) {
    // Toggle sort order: asc → desc → null (no sorting)
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else if (sortDirection.value === 'desc') {
      sortColumn.value = null
      sortDirection.value = null
    }
  } else {
    sortColumn.value = columnKey
    sortDirection.value = 'asc'
  }

  saveSortState()
  emit('sort', sortColumn.value, sortDirection.value, false)
}

watch(
  () => route.path,
  () => {
    loadSortState()
  },
  { immediate: false }
)

onMounted(() => {
  loadSortState()
})
</script>
