import { createApp, h } from 'vue'
import { CONSTANTS } from '@renderer/common/constants'
import i18n from '@renderer/i18n'
import ToastComponent from '@renderer/components/toast/Toast.vue'

export type ToastType = 'info' | 'success' | 'error'

// Track current toast instance
let currentToastApp: any = null
let currentToastContainer: HTMLElement | null = null

/**
 * Removes the current toast if it exists
 */
function removeCurrentToast() {
  if (currentToastApp && currentToastContainer) {
    currentToastApp.unmount()
    document.body.removeChild(currentToastContainer)
    currentToastApp = null
    currentToastContainer = null
  }
}

/**
 * Displays a toast notification with customizable message, type, and duration
 *
 * @param {string} message - The message to display in the toast notification
 * @param {ToastType} [type='info'] - The type of toast notification (info, success, or error)
 * @param {number} [duration=3000] - Duration in milliseconds before the toast auto-closes
 * @param {boolean} [useI18nKey=false] - Whether the message is an i18n key that needs translation
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  duration = 3000,
  useI18nKey = false
) {
  // Remove existing toast before showing new one
  removeCurrentToast()

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(ToastComponent, {
        message,
        type,
        duration,
        useI18nKey,
        onClose: () => {
          app.unmount()
          document.body.removeChild(container)
          // Clear references when toast is closed
          if (currentToastApp === app) {
            currentToastApp = null
            currentToastContainer = null
          }
        }
      })
    }
  })

  // Use the same i18n instance as the main app
  app.use(i18n)

  // Store references to current toast
  currentToastApp = app
  currentToastContainer = container

  app.mount(container)
}

/**
 * Displays an info toast notification
 *
 * @param {string} message - The message to display in the info toast
 * @param {number} [duration=3000] - Duration in milliseconds before the toast auto-closes
 */
export function showInfoToast(message: string, duration = 3000) {
  showToast(message, 'info', duration)
}

/**
 * Displays a success toast notification
 *
 * @param {string} message - The message to display in the success toast
 * @param {number} [duration=3000] - Duration in milliseconds before the toast auto-closes
 */
export function showSuccessToast(message: string, duration = 3000) {
  showToast(message, 'success', duration)
}

/**
 * Displays an error toast notification
 *
 * @param {string} message - The message to display in the error toast
 * @param {boolean} [isUseI18n=true] - Whether to use i18n translation for the message
 * @param {number} [duration=3000] - Duration in milliseconds before the toast auto-closes
 */
export function showErrorToast(message: string, isUseI18n: boolean = true, duration = 3000) {
  if (isUseI18n) {
    showToast(`errors.${message}`, 'error', duration, true)
  } else {
    showToast(message, 'error', duration, false)
  }
}

/**
 * Displays a server error toast notification
 *
 * @param {number} [duration=3000] - Duration in milliseconds before the toast auto-closes
 */
export function showServerErrorToast(duration = 3000) {
  const { SERVER_ERROR } = CONSTANTS.ERR_CODE

  showErrorToast(SERVER_ERROR, true, duration)
}
