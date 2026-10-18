<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'AppContainer' });
</script>
<template><div class="app-container"><slot /></div></template>
<style scoped lang="stylus">
.app-container
  width calc(100% - 48px)
  max-width 1120px
  margin-inline auto

@media (max-width 520px)
  .app-container
    width calc(100% - 32px)
</style>
