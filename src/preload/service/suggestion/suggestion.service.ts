import AbstractService from '../abstract.service'
import { getServerErrorResponse, getSuccessResponse } from '@preload/common/model/response'
import type { AppResponse } from '@preload/common/model/response'
import type { ISuggestion } from '@preload/controller/suggestion/suggestion.type'

class SuggestionService extends AbstractService {
  private readonly CUSTOMER_TYPE = 'customer'

  /**
   * Find customers matching the given key.
   * Searches "phone／name" (case-insensitive) in the customer table.
   *
   * @param key - Search keyword.
   * @returns List of suggestions with phone as `id` and "phone／name" as `text`.
   */
  private async suggestCustomer(key: string): Promise<ISuggestion[]> {
    const lowerKey = key.toLowerCase()
    if (lowerKey.trim() === '／') {
      return []
    }

    const customers = await this.prisma.$queryRaw<{ id: string; text: string }[]>`
      SELECT
        phone as id,
        CONCAT(phone, '／', name) as text
      FROM customer
      WHERE
        LOWER(CONCAT(phone, '／', name)) LIKE ${'%' + lowerKey + '%'}
        AND deleted_at IS NULL
      ORDER BY phone ASC, name ASC
    `

    return customers
  }

  /**
   * Suggest entities by type.
   *
   * @param type - Entity type.
   * @param key - Search keyword.
   * @returns Suggestions wrapped in AppResponse.
   */
  async suggest(type: string, key: string): Promise<AppResponse<any>> {
    try {
      let result: any[] = []
      switch (type) {
        case this.CUSTOMER_TYPE:
          result = await this.suggestCustomer(key)
          break
        default:
      }

      return getSuccessResponse(result)
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }
}

export const suggestionService = new SuggestionService()
