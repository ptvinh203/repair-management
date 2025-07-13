<template>
  <div class="mb-3">
    <label :for="textareaId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <textarea
      v-bind="$attrs"
      :id="textareaId"
      :name="name"
      :value="value"
      :required="isRequired"
      :rows="rows"
      :class="['form-control', textareaClass]"
      @input="handleInput"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AppTextareaProps {
  label: string
  isRequired?: boolean
  name?: string
  textareaClass?: string
  value?: string
  rows?: number
}

const props = withDefaults(defineProps<AppTextareaProps>(), {
  isRequired: false,
  name: '',
  textareaClass: '',
  value: '',
  rows: 3
})

const emit = defineEmits<{
  'update:value': [value: string]
}>()

// Generate unique ID for the textarea
const textareaId = computed(() => {
  return props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event: Event): void => {
  const target = event.target as HTMLTextAreaElement
  emit('update:value', target.value)
}

// Inherit all other attributes
defineOptions({
  inheritAttrs: false
})
</script>

<style lang="scss" scoped></style>
