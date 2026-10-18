<script lang="ts">
import { defineComponent } from 'vue';
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, darkTheme, ruRU, enUS, dateRuRU, dateEnUS } from 'naive-ui';
import UiServiceBridge from '../../shared/ui/UiServiceBridge';
import site from '../../site.config';
export default defineComponent({
  name: 'AppProviders',
  components: { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, UiServiceBridge },
  computed: {
    theme() { return this.$colorMode.value === 'dark' && !this.$colorMode.unknown ? darkTheme : null; },
    locale() { return this.$i18n.locale === 'ru' ? ruRU : enUS; },
    dateLocale() { return this.$i18n.locale === 'ru' ? dateRuRU : dateEnUS; },
    overrides() {
      const colors = site.appearance.colors[this.theme ? 'dark' : 'light'];
      return { common: { primaryColor: colors.primary, primaryColorHover: colors.primaryHover, primaryColorPressed: colors.primaryActive, fontFamily: `${site.appearance.fonts.body}, sans-serif`, borderRadius: '10px' } };
    },
  },
});
</script>
<template>
  <NConfigProvider :theme="theme" :theme-overrides="overrides" :locale="locale" :date-locale="dateLocale">
    <NMessageProvider><NDialogProvider><NNotificationProvider><UiServiceBridge /><slot /></NNotificationProvider></NDialogProvider></NMessageProvider>
  </NConfigProvider>
</template>
