<script lang="ts">
import { defineComponent } from 'vue';
import AppIcon from './AppIcon.vue';
export default defineComponent({ name: 'AppEmptyState', components: { AppIcon }, props: { title: { type: String, required: true }, description: { type: String, default: '' }, icon: { type: String, default: 'lucide:inbox' } } });
</script>
<template><div class="empty-state" role="status"><AppIcon :name="icon" size="32" /><h2>{{ title }}</h2><p>{{ description }}</p><slot /></div></template>
<style scoped lang="stylus">
.empty-state
  display grid
  justify-items center
  gap var(--spacing-4)
  padding var(--spacing-10)
  text-align center
</style>
