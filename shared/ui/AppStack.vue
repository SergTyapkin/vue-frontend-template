<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppStack', props: { direction: { type: String, default: 'column', validator: (value: string) => ['row', 'column'].includes(value) }, gap: { type: String, default: 'var(--spacing-4)' } } });
</script>
<template><div class="app-stack" :class="{ row: direction === 'row' }" :style="{ gap }"><slot /></div></template>
<style scoped lang="stylus">
.app-stack
  display flex
  flex-direction column
.row
  flex-direction row
  align-items center
  flex-wrap wrap
</style>
