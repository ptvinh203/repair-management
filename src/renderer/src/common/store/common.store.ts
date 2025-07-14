import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('common', () => {
  const keyLoading = ref<Record<string, boolean>>({})

  const enableLoading = (key: string) => {
    keyLoading.value[key] = true
  }

  const disableLoading = (key: string) => {
    keyLoading.value[key] = false
  }

  const isLoading = (key?: string) => {
    return (key && keyLoading.value[key]) || false
  }

  return { enableLoading, disableLoading, isLoading }
})
