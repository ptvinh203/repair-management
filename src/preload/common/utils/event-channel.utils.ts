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
