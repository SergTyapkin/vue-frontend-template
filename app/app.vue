<script lang="ts">
import { defineComponent } from 'vue';
import site from '../site.config';
export default defineComponent({ name: 'AppRoot', data: () => ({ pwaEnabled: site.pwa.enabled }) });
</script>
<template>
  <NuxtPwaManifest v-if="pwaEnabled" />
  <NuxtRouteAnnouncer />
  <AppProviders><NuxtLayout><NuxtPage /></NuxtLayout><AppConnectionStatus /><AppCookieNotice /></AppProviders>
</template>
