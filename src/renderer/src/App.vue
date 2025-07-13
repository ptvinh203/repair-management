<template>
  <div class="min-vh-100 bg-light">
    <Header />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import Header from '@renderer/components/nav/Header.vue'
</script>
