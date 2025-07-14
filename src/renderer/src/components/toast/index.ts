import { createApp, h } from 'vue'
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
 */
export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
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
 * @param {number} [duration=3000] - Duration in milliseconds before the toast auto-closes
 */
export function showErrorToast(message: string, duration = 3000) {
  showToast(message, 'error', duration)
}
