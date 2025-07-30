<template>
  <div :class="['card', 'shadow-sm', cardClass]">
    <div v-if="!!title" :class="['card-header', 'bg-white', headerClass]">
      <h3 class="h5 mb-0">{{ title }}</h3>
    </div>

    <div
      :class="['card-body', bodyClass]"
      :style="{
        maxHeight: maxHeight ? `${maxHeight}px` : 'none',
        overflowY: maxHeight ? 'auto' : 'visible'
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CardWrapperProps {
  title?: string
  cardClass?: string
  bodyClass?: string
  headerClass?: string
  maxHeight?: number
}

withDefaults(defineProps<CardWrapperProps>(), {
  cardClass: '',
  bodyClass: '',
  headerClass: ''
})
</script>

<style lang="scss" scoped></style>
