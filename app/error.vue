<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'ErrorPage', props: { error: { type: Object, required: true } }, methods: { home() { this.$nuxt.runWithContext(() => clearError({ redirect: '/' })); } } });
</script>
<template><AppContainer><AppSection><AppHeading as="h1">{{ error.statusCode }}</AppHeading><AppText>{{ error.statusCode === 404 ? $t('notFound') : 'Something went wrong' }}</AppText><AppButton @click="home">{{ $t('home') }}</AppButton></AppSection></AppContainer></template>
