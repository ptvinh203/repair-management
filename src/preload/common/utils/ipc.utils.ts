// import { join } from 'path'
// import { pathToFileURL } from 'url'
// import { is } from '@electron-toolkit/utils'
// import { ipcMain } from 'electron/main'
// import { ipcRenderer } from 'electron/renderer'
// import type { WebContents, WebFrameMain } from 'electron/main'
// import type { IpcRenderer } from 'electron/renderer'
// import type { TEventMapping } from '@preload/index.d'

// export type TIpcRendererOff = () => IpcRenderer
// export type TEventType<T, U> = { payload: T; response: U }
// export type TExtractEventPayload<T> = T extends { payload: infer P } ? P : never
// export type TExtractEventResponse<T> = T extends { response: infer R } ? R : never

// /**
//  * Invokes an IPC method and returns a promise with the result
//  *
//  * @template Key - The event channel key type
//  * @param {Key} key - The event channel identifier
//  * @returns {Promise<TEventMapping[Key]>} Promise that resolves with the response payload
//  * @example
//  * ```typescript
//  * const result = await ipcRendererInvoke('get-user-data');
//  * ```
//  */
// export const ipcRendererInvoke = <Key extends keyof TEventMapping>(
//   key: Key,
//   ...args: any[]
// ): Promise<TExtractEventResponse<TEventMapping[Key]>> => {
//   return ipcRenderer.invoke(key, ...args)
// }

// /**
//  * Registers a listener for IPC events from the main process
//  *
//  * @template Key - The event channel key type
//  * @param {Key} key - The event channel identifier
//  * @param {function} callback - Function to call when the event is received
//  * @param {TEventMapping[Key]} callback.payload - The payload received from the main process
//  * @returns {TIpcRendererOff} Function to remove the event listener
//  * @example
//  * ```typescript
//  * const unsubscribe = ipcRendererOn('user-data-updated', (data) => {
//  *   console.log('Received update:', data);
//  * });
//  *
//  * // Later, remove the listener
//  * unsubscribe();
//  * ```
//  */
// export const ipcRendererOn = <Key extends keyof TEventMapping>(
//   key: Key,
//   callback: (payload: TEventMapping[Key]) => void
// ): TIpcRendererOff => {
//   const cb = (_: Electron.IpcRendererEvent, payload: any): void => callback(payload)
//   ipcRenderer.on(key, cb)

//   return () => ipcRenderer.off(key, cb)
// }

// /**
//  * Sends a message to the main process without expecting a response
//  *
//  * @template Key - The event channel key type
//  * @param {Key} key - The event channel identifier
//  * @param {TEventMapping[Key]} payload - The data to send to the main process
//  * @example
//  * ```typescript
//  * ipcRendererSend('save-user-data', { name: 'John', email: 'john@example.com' });
//  * ```
//  */
// export const ipcRendererSend = <Key extends keyof TEventMapping>(
//   key: Key,
//   payload: TEventMapping[Key]
// ): void => {
//   ipcRenderer.send(key, payload)
// }

// /**
//  * Registers a handler in the main process that can be invoked from the renderer
//  *
//  * @template Key - The event channel key type
//  * @param {Key} key - The event channel identifier
//  * @param {function} handler - Function that handles the IPC invoke request
//  * @returns {TEventMapping[Key]} The response data to send back to the renderer
//  * @throws {Error} Throws an error if the event frame validation fails
//  * @example
//  * ```typescript
//  * ipcMainHandle('get-app-version', () => {
//  *   return app.getVersion();
//  * });
//  * ```
//  */
// export const ipcMainHandle = <Key extends keyof TEventMapping>(
//   key: Key,
//   handler: (...args: any[]) => TExtractEventResponse<TEventMapping[Key]>
// ): void => {
//   ipcMain.handle(key, (event, ...args) => {
//     validateEventFrame(event.senderFrame)

//     return handler(...args)
//   })
// }

// /**
//  * Registers a listener in the main process for messages from the renderer
//  *
//  * @template Key - The event channel key type
//  * @param {Key} key - The event channel identifier
//  * @param {function} handler - Function that handles the received message
//  * @param {TEventMapping[Key]} handler.payload - The payload received from the renderer
//  * @throws {Error} Throws an error if the event frame validation fails
//  * @example
//  * ```typescript
//  * ipcMainOn('save-user-preferences', (preferences) => {
//  *   // Save preferences to database or file
//  *   savePreferences(preferences);
//  * });
//  * ```
//  */
// export const ipcMainOn = <Key extends keyof TEventMapping>(
//   key: Key,
//   handler: (...args: any[]) => void
// ): void => {
//   ipcMain.on(key, (event, ...args) => {
//     validateEventFrame(event.senderFrame)

//     return handler(...args)
//   })
// }

// /**
//  * Sends a message from the main process to a specific renderer process
//  *
//  * @template Key - The event channel key type
//  * @param {Key} key - The event channel identifier
//  * @param {WebContents} webContents - The web contents of the target renderer process
//  * @param {TEventMapping[Key]} payload - The data to send to the renderer
//  * @example
//  * ```typescript
//  * // Send notification to a specific window
//  * ipcWebContentsSend('show-notification', mainWindow.webContents, {
//  *   title: 'Update Available',
//  *   message: 'A new version is ready to install'
//  * });
//  * ```
//  */
// export const ipcWebContentsSend = <Key extends keyof TEventMapping>(
//   key: Key,
//   webContents: WebContents,
//   payload: TEventMapping[Key]
// ): void => {
//   webContents.send(key, payload)
// }

// /**
//  * Validates that an IPC event comes from a trusted source
//  *
//  * @param {WebFrameMain | null} frame - The web frame that sent the IPC event
//  * @throws {Error} Throws "Invalid event frame" if frame is null
//  * @throws {Error} Throws "Malicious event" if the frame URL doesn't match expected sources
//  * @example
//  * ```typescript
//  * ipcMain.handle('secure-operation', (event) => {
//  *   validateEventFrame(event.senderFrame);
//  *   // Proceed with secure operation
//  * });
//  * ```
//  */
// export const validateEventFrame = (frame: WebFrameMain | null): void => {
//   if (!frame) {
//     throw new Error('Invalid event frame')
//   }

//   if (is.dev && new URL(frame.url).host === process.env['ELECTRON_RENDERER_URL']) {
//     return
//   }

//   if (frame.url !== pathToFileURL(join(__dirname, '../renderer/index.html')).toString()) {
//     throw new Error('Malicious event')
//   }
// }
