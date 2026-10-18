<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppHeading', props: { as: { type: String, default: 'h2', validator: (value: string) => /^h[1-6]$/.test(value) }, variant: { type: String, default: 'heading-2' } } });
</script>
<template><component :is="as" :class="variant"><slot /></component></template>
