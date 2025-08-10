<template>
  <div :class="[{ 'mb-3': hasMargin }, wrapperClass]">
    <label v-if="isShowLabel" :for="textareaId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <textarea
      v-bind="$attrs"
      :id="textareaId"
      :name="name"
      :value="modelValue"
      :required="isRequired"
      :rows="rows"
      :maxlength="maxLength"
      :class="['form-control', textareaClass]"
      :placeholder="placeholder || $t('common.placeholder', { field: label.toLocaleLowerCase() })"
      @input="handleInput"
    />
    <div v-if="error" class="text-danger mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    isRequired?: boolean
    name?: string
    textareaClass?: string
    wrapperClass?: string
    modelValue?: string
    rows?: number
    placeholder?: string
    maxLength?: number
    error?: string | null
    isShowLabel?: boolean
    hasMargin?: boolean
  }>(),
  {
    isRequired: false,
    rows: 3,
    isShowLabel: true,
    hasMargin: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Generate unique ID for the textarea
const textareaId = computed(() => {
  return props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event: Event): void => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// Inherit all other attributes
defineOptions({
  inheritAttrs: false
})
</script>

<style lang="scss" scoped></style>
