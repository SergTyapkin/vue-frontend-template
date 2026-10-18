<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppIcon', props: { name: { type: String, required: true }, size: { type: [String, Number], default: 20 }, label: { type: String, default: '' } } });
</script>
<template><Icon :name="name" :size="size" :aria-hidden="!label" :aria-label="label || undefined" :role="label ? 'img' : undefined" /></template>
