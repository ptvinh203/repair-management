<template>
  <div :class="['card', 'shadow-sm', cardClass]">
    <div
      v-if="!!title"
      :class="[
        'card-header',
        'bg-white',
        headerClass,
        { 'd-flex justify-content-between align-items-center': isShowActionButton }
      ]"
    >
      <h3 class="h5 mb-0">{{ title }}</h3>

      <div v-if="isShowActionButton">
        <AppButton
          :title="actionButtonTitle || $t('common.btn-add')"
          :button-class="actionButtonClass"
          @click="$emit('action-button-clicked')"
        />
      </div>
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
import AppButton from '../form/AppButton.vue'

interface CardWrapperProps {
  title?: string
  cardClass?: string
  bodyClass?: string
  headerClass?: string
  maxHeight?: number
  isShowActionButton?: boolean
  actionButtonTitle?: string
  actionButtonClass?: string
}

withDefaults(defineProps<CardWrapperProps>(), {
  cardClass: '',
  bodyClass: '',
  headerClass: '',
  isShowActionButton: false,
  actionButtonClass: 'btn-primary btn-sm'
})

defineEmits<{
  (e: 'action-button-clicked'): void
}>()
</script>

<style lang="scss" scoped></style>
