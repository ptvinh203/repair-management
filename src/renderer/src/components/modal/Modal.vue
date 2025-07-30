<template>
  <div
    v-if="show"
    class="modal fade show"
    :class="{ 'd-block': show }"
    tabindex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="false"
    @click="handleOverlayClick"
  >
    <div class="modal-dialog" :class="modalSizeClass" @click.stop>
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header" :class="headerClass">
          <h1 id="modalLabel" class="modal-title fs-5">
            <i v-if="type === 'confirm'" class="bi bi-question-circle-fill me-2"></i>
            <i v-if="type === 'info'" class="bi bi-info-circle-fill me-2"></i>
            {{ displayTitle }}
          </h1>
          <button
            v-if="showCloseButton"
            type="button"
            class="btn-close"
            :class="{ 'btn-close-white': isWhiteCloseButton }"
            aria-label="Close"
            @click="handleClose"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="mb-0">{{ displayMessage }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <!-- Confirm Modal Buttons -->
          <template v-if="type === 'confirm'">
            <button type="button" class="btn btn-secondary" @click="handleCancel">
              {{ displayCancelText }}
            </button>
            <button type="button" class="btn btn-primary" @click="handleConfirm">
              {{ displayConfirmText }}
            </button>
          </template>

          <!-- Info Modal Button -->
          <template v-if="type === 'info'">
            <button type="button" class="btn btn-primary" @click="handleClose">
              {{ displayOkText }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ModalType, ModalSize } from './index'

const props = withDefaults(
  defineProps<{
    show: boolean
    type: ModalType
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    okText?: string
    size?: ModalSize
    showCloseButton?: boolean
    closeOnOverlay?: boolean
    useI18nKey?: boolean
    centered?: boolean
    scrollable?: boolean
    fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  }>(),
  {
    size: 'md',
    showCloseButton: true,
    closeOnOverlay: true,
    useI18nKey: false,
    centered: false,
    scrollable: false,
    fullscreen: false
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const displayTitle = computed(() => {
  if (props.title) {
    return props.useI18nKey ? t(props.title) : props.title
  }

  return props.type === 'confirm' ? t('modal.confirm.default-title') : t('modal.info.default-title')
})

const displayMessage = computed(() => {
  return props.useI18nKey ? t(props.message) : props.message
})

const displayConfirmText = computed(() => {
  return props.confirmText
    ? props.useI18nKey
      ? t(props.confirmText)
      : props.confirmText
    : t('modal.confirm.default-confirm')
})

const displayCancelText = computed(() => {
  return props.cancelText
    ? props.useI18nKey
      ? t(props.cancelText)
      : props.cancelText
    : t('modal.confirm.default-cancel')
})

const displayOkText = computed(() => {
  return props.okText
    ? props.useI18nKey
      ? t(props.okText)
      : props.okText
    : t('modal.info.default-ok')
})

const modalSizeClass = computed(() => {
  const classes: string[] = []

  // Size classes
  if (props.size === 'sm') classes.push('modal-sm')
  if (props.size === 'lg') classes.push('modal-lg')
  if (props.size === 'xl') classes.push('modal-xl')

  // Centered
  if (props.centered) classes.push('modal-dialog-centered')

  // Scrollable
  if (props.scrollable) classes.push('modal-dialog-scrollable')

  // Fullscreen
  if (props.fullscreen === true) {
    classes.push('modal-fullscreen')
  } else if (typeof props.fullscreen === 'string') {
    classes.push(`modal-fullscreen-${props.fullscreen}-down`)
  }

  return classes.join(' ')
})

const headerClass = computed(() => {
  return {
    'bg-primary text-white': props.type === 'info',
    'bg-warning text-dark': props.type === 'confirm'
  }
})

const isWhiteCloseButton = computed(() => {
  return props.type === 'info'
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    handleClose()
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    handleClose()
  }
}

const updateBodyClass = (show: boolean) => {
  if (show) {
    // Store original body styles to restore later
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const originalWidth = document.body.style.width

    // Get current scroll position
    const scrollY = window.scrollY

    // Apply modal-open class
    document.body.classList.add('modal-open')

    // Prevent scroll completely
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    // Calculate scrollbar width for padding compensation
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Store original styles on body element for restoration
    document.body.dataset.originalOverflow = originalOverflow
    document.body.dataset.originalPosition = originalPosition
    document.body.dataset.originalTop = originalTop
    document.body.dataset.originalWidth = originalWidth
    document.body.dataset.scrollY = scrollY.toString()
  } else {
    // Remove modal-open class
    document.body.classList.remove('modal-open')

    // Restore original styles
    const originalOverflow = document.body.dataset.originalOverflow || ''
    const originalPosition = document.body.dataset.originalPosition || ''
    const originalTop = document.body.dataset.originalTop || ''
    const originalWidth = document.body.dataset.originalWidth || ''
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)

    // Reset styles
    document.body.style.overflow = originalOverflow
    document.body.style.position = originalPosition
    document.body.style.top = originalTop
    document.body.style.width = originalWidth
    document.body.style.paddingRight = ''

    // Clean up data attributes
    delete document.body.dataset.originalOverflow
    delete document.body.dataset.originalPosition
    delete document.body.dataset.originalTop
    delete document.body.dataset.originalWidth
    delete document.body.dataset.scrollY

    // Restore scroll position
    window.scrollTo(0, scrollY)
  }
}

watch(
  () => props.show,
  (newValue) => {
    updateBodyClass(newValue)
  },
  { immediate: true }
)

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  updateBodyClass(false)
})
</script>

<style lang="scss" scoped>
// Custom Bootstrap 5 modal enhancements
.modal {
  --bs-modal-zindex: 1055;
  --bs-modal-width: 500px;
  --bs-modal-padding: 1rem;
  --bs-modal-margin: 0.5rem;
  --bs-modal-color: var(--bs-body-color);
  --bs-modal-bg: var(--bs-body-bg);
  --bs-modal-border-color: var(--bs-border-color-translucent);
  --bs-modal-border-width: var(--bs-border-width);
  --bs-modal-border-radius: var(--bs-border-radius-lg);
  --bs-modal-box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --bs-modal-inner-border-radius: calc(var(--bs-border-radius-lg) - var(--bs-border-width));
  --bs-modal-header-padding-x: 1rem;
  --bs-modal-header-padding-y: 1rem;
  --bs-modal-header-padding: var(--bs-modal-header-padding-y) var(--bs-modal-header-padding-x);
  --bs-modal-header-border-color: var(--bs-border-color);
  --bs-modal-header-border-width: var(--bs-border-width);
  --bs-modal-title-line-height: 1.5;
  --bs-modal-footer-gap: 0.5rem;
  --bs-modal-footer-bg: transparent;
  --bs-modal-footer-border-color: var(--bs-border-color);
  --bs-modal-footer-border-width: var(--bs-border-width);

  z-index: var(--bs-modal-zindex);
}

.modal-dialog {
  pointer-events: none;
  transition: transform 0.3s ease-out;
  transform: translate(0, -50px);
}

.modal.show .modal-dialog {
  transform: none;
}

.modal-backdrop {
  --bs-backdrop-zindex: 1050;
  --bs-backdrop-bg: #000;
  --bs-backdrop-opacity: 0.5;

  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--bs-backdrop-zindex);
  width: 100vw;
  height: 100vh;
  background-color: var(--bs-backdrop-bg);
  opacity: var(--bs-backdrop-opacity);
}

// Custom header colors
.modal-header {
  &.bg-primary {
    border-bottom-color: rgba(255, 255, 255, 0.2);
  }

  &.bg-warning {
    border-bottom-color: rgba(0, 0, 0, 0.125);
  }
}

// Ensure proper stacking
:deep(.modal-content) {
  pointer-events: auto;
}
</style>
