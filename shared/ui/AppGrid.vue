<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppGrid', props: { columns: { type: Number, default: 2 } } });
</script>
<template><div class="app-grid" :style="{ '--columns': columns }"><slot /></div></template>
<style scoped lang="stylus">
.app-grid
  display grid
  grid-template-columns repeat(var(--columns), minmax(0, 1fr))
  gap var(--spacing-5)

@media (max-width 700px)
  .app-grid
    grid-template-columns 1fr
</style>
