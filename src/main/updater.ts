import { autoUpdater } from 'electron-updater'
import { dialog } from 'electron'
import ProgressBar from 'electron-progressbar'

autoUpdater.autoDownload = false

export const checkAndApplyUpdates = () => {
  // Check and notify updates
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    dialog.showErrorBox('Đã xảy ra lỗi', err + ' đã xảy ra trong khi cố gắng tìm kiếm bản cập nhật')
  })

  let progressBar

  // Update available
  autoUpdater.on('update-available', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Cập nhật mới',
        message:
          'Một bản cập nhật mới của ứng dụng đã có sẵn. Bạn có muốn cập nhật ngay bây giờ không?',
        buttons: ['Cập nhật', 'Không']
      })
      .then((res) => {
        if (res.response === 0) {
          autoUpdater.downloadUpdate()
          progressBar = new ProgressBar({
            indeterminate: false,
            text: 'Đang tải xuống bản cập nhật...',
            detail: 'Đang chuẩn bị...',
            abortOnError: true,
            closeOnComplete: false,
            browserWindow: {
              alwaysOnTop: true
            }
          })
          progressBar
            .on('completed', function () {
              progressBar.detail =
                'Bản cập nhật đã được tải xuống. Chúng tôi đang chuẩn bị cài đặt.'
            })
            .on('progress', function (value) {
              progressBar.detail = `Giá trị ${Number(value).toFixed(2)} trong tổng số ${progressBar.getOptions().maxValue}...`
            })
        }
      })
      .catch((err) => {
        dialog.showErrorBox(
          'Lỗi cập nhật',
          'Đã xảy ra lỗi trong quá trình tải xuống bản cập nhật: ' + err.message
        )
      })
  })

  // Download progress
  autoUpdater.on('download-progress', (progressObj) => {
    // Update the progress bar with the current progress
    progressBar.value = progressObj.percent
  })

  // Error
  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('Lỗi cập nhật', 'Đã xảy ra lỗi trong quá trình cập nhật: ' + err.message)
    if (progressBar) {
      progressBar.close()
      progressBar = undefined
    }
  })

  // Update downloaded
  autoUpdater.on('update-downloaded', () => {
    if (progressBar) {
      progressBar.close()
      progressBar = undefined
    }
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Cập nhật sẵn sàng',
        message: 'Bản cập nhật đã được tải xuống. Bạn có muốn thoát và khởi động lại không?',
        buttons: ['Thoát', 'Để sau']
      })
      .then((res) => {
        if (res.response === 0) {
          autoUpdater.quitAndInstall(false, true)
        }
      })
  })
}
