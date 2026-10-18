<script lang="ts">
import { defineComponent } from 'vue';
import site from '../../site.config';
export default defineComponent({
  name: 'ThemeSwitch', data: () => ({ allowed: site.appearance.allowThemeSwitch }),
  methods: { cycleTheme() { const modes = ['system', 'light', 'dark']; this.$colorMode.preference = modes[(modes.indexOf(this.$colorMode.preference) + 1) % modes.length]!; } },
});
</script>
<template><button v-if="allowed" type="button" class="theme-switch" data-testid="theme-switch" :aria-label="$t('theme')" @click="cycleTheme"><AppIcon name="lucide:sun-moon" /><span class="theme-label">{{ $t('theme') }}</span></button></template>
<style scoped lang="stylus">
.theme-switch
  display inline-flex
  align-items center
  gap var(--spacing-2)
  border 1px solid var(--color-border)
  border-radius var(--radius-md)
  padding var(--spacing-2) var(--spacing-3)
  color var(--color-text)
  background var(--color-surface)
  cursor pointer

@media (max-width 520px)
  .theme-label
    display none
</style>
