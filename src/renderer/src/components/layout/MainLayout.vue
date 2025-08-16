<template>
  <div class="main-layout">
    <Header class="fixed-header" />

    <div class="content-container" :style="{ marginTop: `${headerHeight}px` }">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import Header from '@renderer/components/nav/Header.vue'

const headerHeight = ref<number>(0)

const calculateHeaderHeight = () => {
  const header = document.querySelector('.fixed-header')

  return header ? header.getBoundingClientRect().height : 0
}

onMounted(() => {
  headerHeight.value = calculateHeaderHeight()

  window.addEventListener('resize', () => {
    headerHeight.value = calculateHeaderHeight()
  })
})

onBeforeMount(() => {
  headerHeight.value = calculateHeaderHeight()
})
</script>

<style scoped lang="scss">
@import url('./main-layout.style.scss');
</style>
