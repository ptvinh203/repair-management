import { contextBridge } from 'electron/renderer'
import { SearchController } from '@preload/controller/search/search.controller'
import { CustomerController } from '@preload/controller/customer/customer.controller'

/**
 * Context bridge API
 */
contextBridge.exposeInMainWorld('customerController', extractStaticMethods(CustomerController))
contextBridge.exposeInMainWorld('searchController', extractStaticMethods(SearchController))

type ExtractedStaticMethods<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}

/**
 * Extracts all public static methods from a given class constructor into a plain object.
 *
 * This utility filters out:
 * - Built-in class properties (`length`, `name`, `prototype`)
 * - Methods starting with an underscore `_` (considered private by convention)
 *
 * @template T - The class type to extract static methods from
 * @param clazz - The class constructor (not an instance) from which static methods are extracted
 * @returns An object containing only the public static methods of the class, retaining their original types
 */
export function extractStaticMethods<T extends object>(clazz: T): ExtractedStaticMethods<T> {
  const staticMethodNames = Object.getOwnPropertyNames(clazz).filter((key) => {
    const value = (clazz as any)[key]
    const isDefaultFunc = key === 'length' || key === 'name' || key === 'prototype'
    const isPrivateFunc = key.startsWith('_')

    return typeof value === 'function' && !isDefaultFunc && !isPrivateFunc
  })

  const result = {} as ExtractedStaticMethods<T>
  for (const name of staticMethodNames) {
    result[name] = (clazz as any)[name]
  }

  return result
}
