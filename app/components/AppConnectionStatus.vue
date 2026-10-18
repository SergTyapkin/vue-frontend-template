<script lang="ts">
import { defineComponent } from 'vue';
import site from '../../site.config';
export default defineComponent({ name: 'AppConnectionStatus', data: () => ({ showControls: site.features.offlineControls && site.pwa.enabled && site.pwa.offline }) });
</script>
<template><ClientOnly><aside v-if="$offline" class="connection" aria-live="polite"><p v-if="!$offline.state.reachable" role="status">{{ $t($offline.state.download.status === 'ready' ? 'offline' : 'unavailable') }}</p><p v-if="$pwa?.needRefresh">{{ $t('update') }} <button type="button" @click="$pwa.updateServiceWorker()">{{ $t('reload') }}</button></p><details v-if="showControls && $offline.state.supported"><summary>{{ $t('download') }}</summary><button type="button" :disabled="$offline.state.download.status === 'downloading'" @click="$offline.download()">{{ $t('download') }}</button><progress :value="$offline.state.download.percent" max="100" />{{ $offline.state.download.completed }}/{{ $offline.state.download.total }}<button type="button" @click="$offline.clear()">{{ $t('clear') }}</button><p v-if="$offline.state.download.errors.length" role="alert">{{ $offline.state.download.errors.join(', ') }}</p></details></aside></ClientOnly></template>
<style scoped lang="stylus">
.connection
  max-width 1120px
  margin 0 auto
  padding var(--spacing-3) var(--spacing-6)
  color var(--color-text-muted)
  font-size var(--font-size-xs)
  button
    margin var(--spacing-2)
    border 1px solid var(--color-border)
    border-radius var(--radius-sm)
    padding var(--spacing-2)
    color var(--color-text)
    background var(--color-surface)
    cursor pointer
</style>
