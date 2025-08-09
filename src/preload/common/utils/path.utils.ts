import { app } from 'electron'
import path from 'path'

/**
 * Utility function to get the path for extra resources.
 * This is useful for accessing files in the `resources` directory in production.
 *
 * @param subPath - Additional path segments to append to the base resources path.
 * @returns The full path to the specified resource.
 */
export const getExtraResourcePath = (...subPath: string[]) => {
  return path.join(process.resourcesPath, ...subPath)
}

/**
 * Utility function to get the user data path.
 * This is useful for storing application-specific data.
 *
 * @param subPath - Additional path segments to append to the user data path.
 * @returns The full path to the user data directory.
 */
export const getUserDataPath = (...subPath: string[]) => {
  return path.join(app.getPath('userData'), ...subPath)
}
