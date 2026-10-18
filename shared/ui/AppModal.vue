<script lang="ts">
import { defineComponent } from 'vue';
import { NModal } from 'naive-ui';
export default defineComponent({ name: 'AppModal', components: { NModal }, props: { modelValue: Boolean, title: { type: String, required: true } }, emits: ['update:modelValue'] });
</script>
<template><NModal :show="modelValue" preset="card" :title="title" class="app-modal" :style="{ width: 'min(560px, calc(100vw - 32px))' }" @update:show="$emit('update:modelValue', $event)"><slot /></NModal></template>
