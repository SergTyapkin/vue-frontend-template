<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppSection' });
</script>
<template><section class="app-section"><slot /></section></template>
<style scoped lang="stylus">
.app-section
  padding-block var(--spacing-10)
</style>
