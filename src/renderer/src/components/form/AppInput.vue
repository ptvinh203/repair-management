<template>
  <div :class="[hasMargin ? 'mb-3' : wrapperClass]">
    <label v-if="isShowLabel" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <input
      v-bind="$attrs"
      :id="inputId"
      :type="type"
      :name="name"
      :value="modelValue"
      :required="isRequired"
      :disabled="disabled"
      :maxlength="maxLength"
      :class="['form-control', inputClass]"
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
    type?: string
    name?: string
    modelValue?: string | number
    inputClass?: string
    wrapperClass?: string
    hasMargin?: boolean
    placeholder?: string
    disabled?: boolean
    maxLength?: number
    error?: string | null
    isShowLabel?: boolean
  }>(),
  {
    isRequired: false,
    type: 'text',
    hasMargin: true,
    isShowLabel: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Generate unique ID for the input
const inputId = computed(() => {
  return props.name || `input-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const newValue = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', newValue)
}

// Inherit all other attributes
defineOptions({
  inheritAttrs: false
})
</script>

<style lang="scss" scoped></style>
