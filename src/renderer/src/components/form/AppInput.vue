<template>
  <div :class="[hasMargin ? 'mb-3' : '']">
    <label :for="inputId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <input
      v-bind="$attrs"
      :id="inputId"
      :type="type"
      :name="name"
      :value="value"
      :required="isRequired"
      :class="['form-control', inputClass]"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AppInputProps {
  label: string
  isRequired?: boolean
  type?: string
  name?: string
  value?: string | number
  inputClass?: string
  hasMargin?: boolean
}

const props = withDefaults(defineProps<AppInputProps>(), {
  isRequired: false,
  type: 'text',
  name: '',
  value: '',
  inputClass: '',
  hasMargin: true
})

const emit = defineEmits<{
  'update:value': [value: string | number]
}>()

// Generate unique ID for the input
const inputId = computed(() => {
  return props.name || `input-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const newValue = props.type === 'number' ? Number(target.value) : target.value
  emit('update:value', newValue)
}

// Inherit all other attributes
defineOptions({
  inheritAttrs: false
})
</script>

<style lang="scss" scoped></style>
