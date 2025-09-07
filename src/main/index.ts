import { app, shell, BrowserWindow, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { masterService } from '@preload/service/master.service'
import { initIpcMainHandlers } from '@main/ipc-main-init'
import { initializeLogger } from '@preload/common/utils/log.utils'
import { copyDbFile } from '@preload/common/utils/path.utils'
import { checkAndApplyUpdates } from './updater'
import iconPng from '../../resources/icon.png?asset'
import iconIco from '../../resources/icon.ico?asset'
import iconIcns from '../../resources/icon.icns?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Set icon browser window
  switch (process.platform) {
    case 'darwin':
      mainWindow.setIcon(iconIcns)
      break
    case 'win32':
      mainWindow.setIcon(iconIco)
      break
    default:
      mainWindow.setIcon(iconPng)
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)

    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Check and apply updates after 1.5 seconds
  setTimeout(() => {
    checkAndApplyUpdates()
  }, 1500)
}

app.whenReady().then(() => {
  copyDbFile() // Ensure the database file is copied to the user data path
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Initialize handlers, logger and Common table with default data
  initIpcMainHandlers()
  initializeLogger(!is.dev)
  masterService.initializeData()

  // Set dock icon
  const dockIcon = nativeImage.createFromPath(iconPng)
  if (typeof app.dock === 'object') {
    app.dock.setIcon(dockIcon)
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
