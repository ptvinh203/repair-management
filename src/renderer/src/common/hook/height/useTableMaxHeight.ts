import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Custom hook to calculate the maximum height for a table based on the viewport height
 * and subtracting heights of specified selectors.
 *
 * @param {string[]} selectorsToSubtract - Array of CSS selectors whose heights will be subtracted from the viewport height.
 * @param {number} extraMargin - Additional margin to subtract from the calculated height.
 * @returns {object} An object containing the maxHeight reactive reference.
 */
export const useTableMaxHeight = (
  selectorsToSubtract: string[] = ['.navbar', '.card-header'],
  extraMargin: number = 35
) => {
  const maxHeight = ref<number>(0)

  const calculateMaxHeight = () => {
    let subtractHeight = 0

    selectorsToSubtract.forEach((selector) => {
      const el = document.querySelector(selector)
      if (el) {
        subtractHeight += el.getBoundingClientRect().height
      }
    })

    maxHeight.value = window.innerHeight - subtractHeight - extraMargin
  }

  onMounted(() => {
    calculateMaxHeight()
    window.addEventListener('resize', calculateMaxHeight)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', calculateMaxHeight)
  })

  return {
    maxHeight
  }
}
