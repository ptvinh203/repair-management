<template>
  <div :class="[{ 'mb-3': hasMargin }]">
    <label v-if="isShowLabel" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <div>
      <Datepicker
        v-model="internalValue"
        :typeable="true"
        :input-class="['form-control px-3 py-2', inputClass]"
        :add-bootstrap-class="false"
        :format="formatDate"
        :placeholder="placeholder"
        :disabled="disabled"
        :icon-height="0"
        :icon-width="0"
        @update:model-value="handleChange"
      />
    </div>
    <div v-if="error" class="text-danger mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Datepicker from 'vuejs3-datepicker'
import { format, parse } from 'date-fns'
import { CONSTANTS } from '@renderer/common/constants'

const props = withDefaults(
  defineProps<{
    modelValue?: Date | string | null
    label?: string
    name?: string
    placeholder?: string
    disabled?: boolean
    hasMargin?: boolean
    isShowLabel?: boolean
    isRequired?: boolean
    error?: string | null
    inputClass?: string
  }>(),
  {
    hasMargin: true,
    placeholder: CONSTANTS.DATE_FORMAT.DEFAULT,
    isShowLabel: true,
    isRequired: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | string | null): void
}>()

const getDate = (date?: Date | string | null): Date => {
  if (!date) return new Date()
  if (typeof date === 'string') {
    return parse(date, CONSTANTS.DATE_FORMAT.DEFAULT, new Date())
  }

  return date
}

const internalValue = ref<Date>(getDate(props.modelValue))

const inputId = computed(() => {
  return props.name || `datepicker-${Math.random().toString(36).substr(2, 9)}`
})

const formatDate = (date: Date | null): string => {
  if (!date) return ''

  return format(date, CONSTANTS.DATE_FORMAT.DEFAULT)
}

const handleChange = (payload?: Date | null) => {
  if (!payload) {
    if (props.modelValue) {
      internalValue.value =
        typeof props.modelValue === 'string' ? getDate(props.modelValue) : props.modelValue
    } else {
      internalValue.value = new Date()
    }

    return
  }

  emit('update:modelValue', formatDate(payload))
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      internalValue.value = typeof val === 'string' ? getDate(val) : val
    } else {
      internalValue.value = new Date()
    }
  }
)
</script>

<style scoped lang="scss">
.vuejs3-datepicker {
  width: 100%;
}
</style>
