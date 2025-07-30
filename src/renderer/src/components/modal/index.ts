import { createApp, h } from 'vue'
import i18n from '@renderer/i18n'
import ModalComponent from './Modal.vue'

export type ModalType = 'info' | 'confirm'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalOptions {
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
}

export interface ConfirmModalOptions extends ModalOptions {
  onConfirm?: () => void
  onCancel?: () => void
}

export interface InfoModalOptions extends ModalOptions {
  onClose?: () => void
}

// Track current modal instance
let currentModalApp: any = null
let currentModalContainer: HTMLElement | null = null

/**
 * Removes the current modal if it exists
 */
function removeCurrentModal() {
  if (currentModalApp && currentModalContainer) {
    currentModalApp.unmount()
    document.body.removeChild(currentModalContainer)
    currentModalApp = null
    currentModalContainer = null
  }
}

/**
 * Creates and shows a modal with the specified type and options
 */
function createModal(
  type: ModalType,
  options: ModalOptions & { onConfirm?: () => void; onCancel?: () => void; onClose?: () => void }
) {
  // Remove existing modal before showing new one
  removeCurrentModal()

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(ModalComponent, {
        show: true,
        type,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        okText: options.okText,
        size: options.size || 'md',
        showCloseButton: options.showCloseButton !== false,
        closeOnOverlay: options.closeOnOverlay !== false,
        useI18nKey: options.useI18nKey || false,
        centered: options.centered || false,
        scrollable: options.scrollable || false,
        fullscreen: options.fullscreen || false,
        onConfirm: () => {
          options.onConfirm?.()
          cleanup()
        },
        onCancel: () => {
          options.onCancel?.()
          cleanup()
        },
        onClose: () => {
          options.onClose?.()
          cleanup()
        }
      })
    }
  })

  const cleanup = () => {
    app.unmount()
    document.body.removeChild(container)
    // Clear references when modal is closed
    if (currentModalApp === app) {
      currentModalApp = null
      currentModalContainer = null
    }
  }

  // Use the same i18n instance as the main app
  app.use(i18n)

  // Store references to current modal
  currentModalApp = app
  currentModalContainer = container

  app.mount(container)
}

/**
 * Shows a confirmation modal with confirm and cancel buttons
 * Returns a Promise that resolves with true if confirmed, false if cancelled
 *
 * @param message - The message to display in the modal
 * @param options - Additional options for the modal
 * @returns Promise<boolean> - Resolves to true if confirmed, false if cancelled
 */
export function showConfirmModal(
  message: string = 'modal.confirm.update-generic',
  options: Omit<ConfirmModalOptions, 'message'> = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    createModal('confirm', {
      ...options,
      message,
      useI18nKey: true,
      centered: true,
      onConfirm: () => {
        options.onConfirm?.()
        resolve(true)
      },
      onCancel: () => {
        options.onCancel?.()
        resolve(false)
      },
      onClose: () => {
        options.onCancel?.()
        resolve(false)
      }
    })
  })
}

/**
 * Shows an information modal with an OK button
 * Returns a Promise that resolves when the modal is closed
 *
 * @param message - The message to display in the modal
 * @param options - Additional options for the modal
 * @returns Promise<void> - Resolves when the modal is closed
 */
export function showInfoModal(
  message: string,
  options: Omit<InfoModalOptions, 'message'> = {}
): Promise<void> {
  return new Promise((resolve) => {
    createModal('info', {
      ...options,
      message,
      centered: true,
      onClose: () => {
        options.onClose?.()
        resolve()
      }
    })
  })
}

/**
 * Shows a delete confirmation modal with predefined styling and text
 * Returns a Promise that resolves with true if confirmed, false if cancelled
 *
 * @param itemName - The name of the item being deleted
 * @param options - Additional options for the modal
 * @returns Promise<boolean> - Resolves to true if confirmed, false if cancelled
 */
export function showDeleteConfirmModal(
  itemName: string = '',
  options: Omit<ConfirmModalOptions, 'message'> = {}
): Promise<boolean> {
  const message = itemName ? `modal.confirm.delete-with-name` : `modal.confirm.delete-generic`

  return showConfirmModal(message, {
    title: 'modal.confirm.delete-title',
    confirmText: 'modal.confirm.delete-confirm',
    cancelText: 'modal.confirm.delete-cancel',
    useI18nKey: true,
    centered: true,
    ...options
  })
}

/**
 * Shows a success information modal
 * Returns a Promise that resolves when the modal is closed
 *
 * @param message - The message to display in the modal
 * @param options - Additional options for the modal
 * @returns Promise<void> - Resolves when the modal is closed
 */
export function showSuccessModal(
  message: string,
  options: Omit<InfoModalOptions, 'message'> = {}
): Promise<void> {
  return showInfoModal(message, {
    title: 'modal.info.success-title',
    centered: true,
    ...options
  })
}

/**
 * Shows an error information modal
 * Returns a Promise that resolves when the modal is closed
 *
 * @param message - The message to display in the modal
 * @param options - Additional options for the modal
 * @returns Promise<void> - Resolves when the modal is closed
 */
export function showErrorModal(
  message: string,
  options: Omit<InfoModalOptions, 'message'> = {}
): Promise<void> {
  return showInfoModal(message, {
    title: 'modal.info.error-title',
    useI18nKey: true,
    centered: true,
    ...options
  })
}

/**
 * Shows a large scrollable modal for detailed content
 * Returns a Promise that resolves when the modal is closed
 *
 * @param message - The message to display in the modal
 * @param options - Additional options for the modal
 * @returns Promise<void> - Resolves when the modal is closed
 */
export function showLargeModal(
  message: string,
  options: Omit<InfoModalOptions, 'message'> = {}
): Promise<void> {
  return showInfoModal(message, {
    size: 'lg',
    scrollable: true,
    centered: true,
    ...options
  })
}

/**
 * Shows a fullscreen modal for maximum content display
 * Returns a Promise that resolves when the modal is closed
 *
 * @param message - The message to display in the modal
 * @param options - Additional options for the modal
 * @returns Promise<void> - Resolves when the modal is closed
 */
export function showFullscreenModal(
  message: string,
  options: Omit<InfoModalOptions, 'message'> = {}
): Promise<void> {
  return showInfoModal(message, {
    fullscreen: true,
    ...options
  })
}

/**
 * Closes the currently open modal if any
 */
export function closeModal() {
  removeCurrentModal()
}
