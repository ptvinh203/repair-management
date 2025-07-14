<template>
  <div v-if="isLoading" class="loading-overlay" :class="wrapperClass">
    <div :class="['spinner-grow', loadingClass]" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCommonStore } from '@renderer/common/store/common.store'
import './loading.style.scss'

const commonStore = useCommonStore()

const props = defineProps<{
  isLoading?: boolean
  keyLoading?: string
  loadingClass?: string
  wrapperClass?: string
}>()

const isLoading = computed(() => props.isLoading || commonStore.isLoading(props.keyLoading))
</script>
