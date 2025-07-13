import { PrismaClient } from '@prisma/client'

class AbstractService {
  protected prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
}

export default AbstractService
