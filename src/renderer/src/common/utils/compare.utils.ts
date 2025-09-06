/**
 * Deeply compares two objects for equality.
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @returns True if the objects are equal, false otherwise.
 */
export const isEquals = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
