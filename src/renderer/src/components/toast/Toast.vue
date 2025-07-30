<template>
  <div class="position-fixed top-0 end-0 p-3 z-index-11">
    <div
      class="toast show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :class="toastClass"
    >
      <div class="toast-header" :class="toastClass">
        <strong class="me-auto">{{ $t(`common.notificate-from-system`) }}</strong>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          @click="close"
        ></button>
      </div>
      <div class="toast-body">{{ displayMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ToastType } from '.'

const props = withDefaults(
  defineProps<{
    message: string
    type: ToastType
    duration?: number
    useI18nKey?: boolean
  }>(),
  {
    duration: 3000,
    useI18nKey: false
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()

const displayMessage = computed(() => {
  return props.useI18nKey ? t(props.message) : props.message
})

const toastClass = {
  'bg-info text-white': props.type === 'info',
  'bg-success text-white': props.type === 'success',
  'bg-danger text-white': props.type === 'error'
}

const close = () => emit('close')

onMounted(() => {
  setTimeout(() => {
    close()
  }, props.duration)
})
</script>

<style lang="css" scoped>
.z-index-11 {
  z-index: 11;
}
</style>
