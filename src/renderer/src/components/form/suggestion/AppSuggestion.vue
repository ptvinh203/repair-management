<template>
  <div ref="wrapperRef" :class="[{ 'mb-2': hasMargin }, wrapperClass]">
    <label v-if="isShowLabel" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>

    <div class="position-relative">
      <input
        v-bind="$attrs"
        :id="inputId"
        ref="inputRef"
        type="text"
        :name="name"
        :value="inputValue.text"
        :required="isRequired"
        :disabled="disabled"
        :maxlength="maxLength"
        :class="['form-control', inputClass, { 'pe-5': true }]"
        :placeholder="placeholder || $t('common.placeholder', { field: label.toLocaleLowerCase() })"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <div class="position-absolute top-50 end-0 translate-middle-y pe-3">
        <div v-if="isLoading" class="spinner-border" style="width: 1rem; height: 1rem"></div>
        <i v-else class="bi bi-search"></i>
      </div>

      <div
        v-if="showDropdown && suggestions.length > 0"
        ref="dropdownRef"
        :class="[
          'position-absolute w-100 bg-white border rounded shadow dropdown',
          dropdownPositionClass
        ]"
      >
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          :class="[
            'px-3 py-2 border-bottom cursor-pointer',
            { 'bg-light': highlightedIndex === index }
          ]"
          @mousedown.prevent="selectSuggestion(item)"
          @mouseenter="highlightedIndex = index"
        >
          {{ item.text }}
        </div>
      </div>
    </div>

    <div v-if="error" class="text-danger mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { isEquals } from '@renderer/common/utils/compare.utils'
import type { ISuggestion } from './app-suggestion.type'

const props = withDefaults(
  defineProps<{
    label: string
    isRequired?: boolean
    suggestion?: string
    modelValue?: ISuggestion
    inputClass?: string
    wrapperClass?: string
    hasMargin?: boolean
    placeholder?: string
    disabled?: boolean
    maxLength?: number
    error?: string | null
    isShowLabel?: boolean
    name?: string
  }>(),
  {
    isRequired: false,
    suggestion: 'customer',
    hasMargin: true,
    isShowLabel: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: ISuggestion]
}>()

const inputRef = ref<HTMLInputElement>()
const dropdownRef = ref<HTMLDivElement>()
const wrapperRef = ref<HTMLDivElement>()
const inputValue = ref<ISuggestion>(props.modelValue ?? ({} as ISuggestion))
const suggestions = ref<ISuggestion[]>([])
const showDropdown = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const highlightedIndex = ref<number>(-1)
const debounce = ref<ReturnType<typeof setTimeout>>()

const inputId = computed(
  () => props.name || `suggestion-input-${Math.random().toString(36).substr(2, 9)}`
)

/**
 * Determine dropdown position (above or below input) based on available space
 */
const dropdownPositionClass = computed(() => {
  if (!inputRef.value) return 'top-100'

  const rect = inputRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const spaceBelow = windowHeight - rect.bottom
  const spaceAbove = rect.top

  // If more space above and not enough space below (less than 200px for dropdown)
  if (spaceAbove > spaceBelow && spaceBelow < 200) {
    return 'bottom-100 mb-1'
  }

  return 'top-100 mt-1'
})

const clearSuggestions = (): void => {
  suggestions.value = []
  showDropdown.value = false
  isLoading.value = false
  highlightedIndex.value = -1
}

/**
 * Handle input changes with debounce
 * @param event Input event
 */
const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = target.value

  inputValue.value = { text: value }
  emit('update:modelValue', inputValue.value)
  highlightedIndex.value = -1 // Reset highlighted index

  if (debounce.value) {
    clearTimeout(debounce.value) // Clear existing timeout
  }

  if (value.trim().length > 0) {
    isLoading.value = true
    showDropdown.value = true

    // Debounce API call by 300ms
    debounce.value = setTimeout(async () => {
      try {
        suggestions.value = []
        const { data } = await window.suggestionController.suggest(props.suggestion!, value.trim())
        if (data && data.length === 1) {
          selectSuggestion(data[0])
        } else {
          suggestions.value = data || []
        }
      } catch {
        clearSuggestions()
      } finally {
        isLoading.value = false
      }
    }, 300)
  } else {
    clearSuggestions()
  }
}
/**
 * Handle input focus. Show dropdown if there are suggestions.
 */
const handleFocus = (): void => {
  if ((inputValue.value.text?.trim().length ?? 0) > 0 && suggestions.value.length > 0) {
    showDropdown.value = true
  }
}

/**
 * Handle input blur with delay hiding dropdown to allow click events
 * Delay: 150ms
 */
const handleBlur = (): void => {
  setTimeout(() => {
    showDropdown.value = false
    highlightedIndex.value = -1
  }, 150)
}

/**
 * Handle keyboard for navigation in suggestion dropdown
 * @param event KeyboardEvent
 */
const handleKeydown = (event: KeyboardEvent): void => {
  if (!showDropdown.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectSuggestion(suggestions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      clearSuggestions()
      break
  }
}

const selectSuggestion = (suggestion: ISuggestion): void => {
  inputValue.value = suggestion
  emit('update:modelValue', suggestion)
  clearSuggestions()

  // Focus back to input
  nextTick(() => {
    inputRef.value?.focus()
  })
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!isEquals(newValue, inputValue.value)) {
      inputValue.value = newValue ?? ({} as ISuggestion)
    }
  }
)

/**
 * Handle clicks outside component to close dropdown
 * @param event Event
 */
const handleClickOutside = (event: Event): void => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    showDropdown.value = false
    highlightedIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Handle ESC key globally
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && showDropdown.value) {
      clearSuggestions()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounce.value) {
    clearTimeout(debounce.value)
  }
})

// Inherit all other attributes
defineOptions({ inheritAttrs: false })
</script>

<style lang="scss" scoped>
@import './app-suggestion.style.scss';
</style>
