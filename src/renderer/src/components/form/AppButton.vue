<template>
  <button :class="['btn', buttonClass]" :disabled="disabled" @click="handleClick">
    <span :class="titleClass">{{ title }}</span>
  </button>
</template>

<script setup lang="ts">
interface AppButtonProps {
  title: string
  disabled?: boolean
  titleClass?: string
  buttonClass?: string
}

const props = withDefaults(defineProps<AppButtonProps>(), {
  disabled: false,
  titleClass: '',
  buttonClass: 'btn-primary'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped></style>
