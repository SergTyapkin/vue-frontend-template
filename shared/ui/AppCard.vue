<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppCard' });
</script>
<template><div class="app-card"><slot /></div></template>
<style scoped lang="stylus">
.app-card
  display grid
  align-content start
  gap var(--spacing-4)
  border 1px solid var(--color-border)
  border-radius var(--radius-lg)
  padding var(--spacing-7)
  background var(--color-surface)
</style>
