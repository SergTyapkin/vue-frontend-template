<script lang="ts">
import { defineComponent } from 'vue';
import { NButton } from 'naive-ui';
export default defineComponent({ name: 'AppButton', components: { NButton }, props: { href: { type: String, default: undefined }, loading: Boolean, disabled: Boolean }, });
</script>
<template><NButton class="app-button" type="primary" size="large" :tag="href ? 'a' : 'button'" :href="href" :loading="loading" :disabled="disabled"><span class="content"><slot /></span></NButton></template>
<style scoped lang="stylus">
.app-button
  min-height 48px
  font-weight var(--font-weight-semibold)
.content
  display inline-flex
  align-items center
  gap var(--spacing-3)
</style>
