<script lang="ts">
import { defineComponent } from 'vue';
import site from '../../site.config';
export default defineComponent({
  name: 'LocaleSwitch', data: () => ({ allowed: site.i18n.allowLocaleSwitch, locales: site.i18n.locales }),
  methods: { async change(event: Event) { await this.$i18n.setLocale((event.target as HTMLSelectElement).value as 'ru' | 'en'); } },
});
</script>
<template><label v-if="allowed && locales.length > 1" class="locale-switch"><AppIcon name="lucide:languages" /><span class="sr-only">{{ $t('language') }}</span><select :value="$i18n.locale" data-testid="locale-switch" @change="change"><option v-for="locale in locales" :key="locale.code" :value="locale.code">{{ locale.name }}</option></select></label></template>
<style scoped lang="stylus">
.locale-switch
  display inline-flex
  align-items center
  gap var(--spacing-2)
  select
    border 0
    color var(--color-text)
    background var(--color-background)
    font inherit
</style>
