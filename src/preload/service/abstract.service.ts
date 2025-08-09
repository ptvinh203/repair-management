import fs from 'fs'
import { is } from '@electron-toolkit/utils'
import { getExtraResourcePath, getUserDataPath } from '@preload/common/utils/path.utils'
import { PrismaClient } from '@prisma/client'

class AbstractService {
  protected prisma: PrismaClient

  constructor() {
    const env: any = import.meta.env
    const DB_URL = env.MAIN_VITE_DATABASE_URL
    const dbPath = is.dev ? DB_URL : getUserDataPath('database.db')

    if (!is.dev) {
      try {
        fs.copyFileSync(getExtraResourcePath(DB_URL), dbPath, fs.constants.COPYFILE_EXCL)
      } catch (err: any) {
        if (err.code !== 'EEXIST') {
          console.error(`Failed creating sqlite file.`, err)
        } else {
          console.error('Database file detected')
        }
      }
    }

    // Initialize Prisma Client with the database path
    this.prisma = new PrismaClient({
      datasources: {
        db: { url: `file:${dbPath}` }
      }
    })
  }
}

export default AbstractService
