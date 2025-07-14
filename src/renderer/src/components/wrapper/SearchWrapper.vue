<template>
  <div :class="['card', 'shadow-sm', wrapperClass]">
    <!-- Card Header with Title -->
    <div class="card-header bg-white">
      <h3 class="h5 mb-0">{{ title }}</h3>
    </div>

    <!-- Card Body - Form Content -->
    <div class="card-body border-bottom-0">
      <slot></slot>
    </div>

    <!-- Card Footer - Action Buttons -->
    <div class="card-footer bg-white border-top-0 d-flex justify-content-end gap-2 pt-0">
      <slot name="extra-buttons" />

      <!-- Default Search Button -->
      <AppButton
        v-if="showDefaultButton"
        :title="$t('common.search')"
        button-class="btn-primary"
        @click="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@renderer/components/form/AppButton.vue'

interface SearchWrapperProps {
  title: string
  showDefaultButton?: boolean
  wrapperClass?: string
}

withDefaults(defineProps<SearchWrapperProps>(), {
  showDefaultButton: true,
  wrapperClass: '',
  extraButtons: () => []
})

const emit = defineEmits<{
  onSearch: []
}>()

const handleSearch = (): void => {
  emit('onSearch')
}
</script>

<style lang="scss" scoped>
.card-footer {
  padding: 0.75rem 1.25rem;
}
</style>
