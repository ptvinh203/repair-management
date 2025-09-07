import { ipcMain } from 'electron/main'
import { log } from './log.utils'
import type { AppResponse } from '../model/response'

/**
 * Utility function to create an event channel string
 *
 * @param baseModule The base module name
 * @param rendererMethod The method to be invoked in the renderer
 * @param name The name of the event
 * @returns The constructed event channel string
 */
export const getEventChannel = (baseModule: string, rendererMethod: string, name: string) => {
  return `${baseModule}:${rendererMethod}:${name}`
}

/**
 * Registers an IPC main handler for a specific channel with error handling and logging.
 *
 * @param {string} channel - The IPC channel to handle.
 * @param {(...args: any[]) => Promise<any>} handler - The async handler function to process the IPC call.
 */
export const ipcMainHandler = (
  channel: string,
  handler: (...args: any[]) => Promise<any>
): void => {
  ipcMain.handle(channel, async (_, ...args) => {
    try {
      const response = await handler(...args)
      if (typeof response === 'object' && 'error' in response) {
        const { code, message } = (response as AppResponse).error || {}

        // Log server errors and bad requests
        if (code === 'ERR00000000') {
          log('error', `[${channel}] Server error: ${code || ''} - ${message || ''}`)
        } else if (code || message) {
          log('error', `[${channel}] Bad request: ${code || ''} - ${message || ''}`)
        }
      }

      return response
    } catch (error) {
      log(
        'error',
        `[${channel}] Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )

      return null
    }
  })
}
