import fs from 'fs'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
import { log } from './log.utils'

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

/**
 * Utility function to log debug messages to a file.
 * It appends the message with a timestamp to a debug log file in the user data directory.
 *
 * @param message - The message to log.
 */
export const logDebug = (message: string) => {
  const logFile = path.join(app.getPath('userData'), 'debug.log')
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`)
}

/**
 * Utility function to copy a file from source to destination.
 * It ensures that the destination directory exists and handles errors gracefully.
 *
 * @param source - The path to the source file.
 * @param destination - The path where the file should be copied.
 */
export const copyFile = async (source: string, destination: string) => {
  if (!fs.existsSync(source) || fs.existsSync(destination)) {
    return
  }

  // Ensure destination folder exists
  const destDir = path.dirname(destination)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  try {
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  } catch (err) {
    log(
      'error',
      `[path.utils] Error copying file from ${source} to ${destination}: ${(err as Error).message}`
    )
  }
}

/**
 * Utility function to copy the database file from the extra resources path
 * to the user data path, ensuring it exists for the application to use.
 */
export const copyDbFile = () => {
  const env: any = import.meta.env
  const DB_URL = env.MAIN_VITE_DATABASE_URL
  const dbPath = is.dev ? DB_URL : getUserDataPath('database.db')

  if (!is.dev) {
    copyFile(getExtraResourcePath(DB_URL), dbPath)
  }
}
