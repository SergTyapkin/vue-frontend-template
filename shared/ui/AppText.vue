<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppText', props: { muted: Boolean, variant: { type: String, default: 'body' } } });
</script>
<template><p :class="[variant, { muted }]"><slot /></p></template>
<style scoped lang="stylus">
.muted
  color var(--color-text-muted)
</style>
