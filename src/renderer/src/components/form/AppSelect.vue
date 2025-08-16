<template>
  <div :class="[{ 'mb-2': hasMargin }, wrapperClass]">
    <label v-if="isShowLabel" :for="selectId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <select
      :id="selectId"
      :name="name"
      :value="currentValue"
      :required="isRequired"
      :class="['form-select', selectClass]"
      :disabled="disabled"
      @change="handleChange"
    >
      <option v-if="hasBlankOption" value=""></option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.key }}
      </option>
    </select>
    <div v-if="error" class="text-danger mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ISelectOption } from '@renderer/common/utils/option.util'

interface AppSelectProps {
  label: string
  isRequired?: boolean
  name?: string
  selectClass?: string
  wrapperClass?: string
  modelValue?: string | number
  options: ISelectOption[]
  hasBlankOption?: boolean
  hasMargin?: boolean
  isDefault?: boolean
  isShowLabel?: boolean
  error?: string | null
  disabled?: boolean
}

const props = withDefaults(defineProps<AppSelectProps>(), {
  isRequired: false,
  name: '',
  selectClass: '',
  modelValue: '',
  hasBlankOption: true,
  hasMargin: true,
  isDefault: false,
  isShowLabel: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const currentValue = ref<string | number>(props.modelValue)

// Generate unique ID for the select
const selectId = computed(() => {
  return props.name || `select-${Math.random().toString(36).substr(2, 9)}`
})

const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  const newValue = target.value
  currentValue.value = newValue
  emit('update:modelValue', newValue)
}

onMounted(() => {
  if (props.isDefault && !props.modelValue && props.options.length > 0) {
    const defaultValue = props.options[0].value
    currentValue.value = defaultValue
    emit('update:modelValue', defaultValue)
  } else if (props.modelValue) {
    currentValue.value = props.modelValue
  }
})

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      currentValue.value = newValue
    }
  }
)
</script>

<style lang="scss" scoped></style>
