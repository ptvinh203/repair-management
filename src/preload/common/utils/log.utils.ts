import path from 'path'
import logger from 'electron-log/main'
import { format } from 'date-fns'
import type { LogMessage, PathVariables } from 'electron-log'

/**
 * Initialize the logger for the main process.
 * This function sets up the logger to be used throughout the main process.
 */
export const initializeLogger = (isProduction: boolean) => {
  logger.initialize()

  // Disable console logging in production
  if (isProduction) {
    logger.transports.console.level = false
  }

  // Configure file name format and location
  logger.transports.file.resolvePathFn = (variables: PathVariables, message?: LogMessage) => {
    const currentMonth = format(message?.date || new Date(), 'MM-yyyy')

    return path.join(variables.appData, variables.appName, 'logs', `${currentMonth}.log`)
  }

  // Handle uncaught exceptions and unhandled rejections
  logger.errorHandler.startCatching({
    showDialog: false,
    onError({ error, processType }) {
      if (processType === 'renderer') {
        return
      }

      log('error', `Uncaught Exception: ${error.message}\n${error.stack}`)
    }
  })
}

/**
 * Log a message with a specified level.
 * @param level - The log level ('info', 'warn', 'error').
 * @param message - The message to log.
 */
export const log = (level: 'info' | 'warn' | 'error', message: string) => {
  logger[level](`[main] ${message}`)
}
