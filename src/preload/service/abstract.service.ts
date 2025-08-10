import { is } from '@electron-toolkit/utils'
import { getUserDataPath } from '@preload/common/utils/path.utils'
import { PrismaClient } from '@prisma/client'

class AbstractService {
  protected prisma: PrismaClient

  constructor() {
    const env: any = import.meta.env
    const DB_URL = env.MAIN_VITE_DATABASE_URL
    const dbPath = is.dev ? DB_URL : getUserDataPath('database.db')

    // Initialize Prisma Client with the database path
    this.prisma = new PrismaClient({
      datasources: {
        db: { url: `file:${dbPath}` }
      }
    })
  }
}

export default AbstractService
