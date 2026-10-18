<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppImage', inheritAttrs: false, props: { src: { type: String, required: true }, alt: { type: String, required: true }, width: { type: [Number, String], required: true }, height: { type: [Number, String], required: true }, priority: Boolean, fallback: { type: String, default: '/branding/logo.svg' } }, data: () => ({ failed: false }), watch: { src() { this.failed = false; } } });
</script>
<template><NuxtImg v-bind="$attrs" :src="failed ? fallback : src" :alt="alt" :width="width" :height="height" :loading="priority ? 'eager' : 'lazy'" :fetchpriority="priority ? 'high' : 'auto'" :preload="priority" @error="failed = true" /></template>
