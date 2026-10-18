<script lang="ts">
import { defineComponent } from 'vue';
import AppButton from '../../shared/ui/AppButton.vue';
import AppIcon from '../../shared/ui/AppIcon.vue';

const acknowledgementKey = 'cookie-notice:acknowledged:v1';

export default defineComponent({
  name: 'AppCookieNotice',
  components: { AppButton, AppIcon },
  data: () => ({ visible: false }),
  mounted() {
    try {
      this.visible = window.localStorage.getItem(acknowledgementKey) !== 'true';
    } catch {
      this.visible = true;
    }
  },
  methods: {
    acknowledge() {
      try {
        window.localStorage.setItem(acknowledgementKey, 'true');
      } catch {
        // Storage may be unavailable; still dismiss for this visit.
      }
      this.visible = false;
    },
  },
});
</script>

<template>
  <Transition name="cookie-notice">
    <aside v-if="visible" class="cookie-notice" aria-labelledby="cookie-notice-title" data-testid="cookie-notice">
      <span class="cookie-icon"><AppIcon name="lucide:cookie" :size="28" /></span>
      <div class="cookie-copy">
        <h2 id="cookie-notice-title">{{ $t('cookies.title') }}</h2>
        <p>{{ $t('cookies.message') }}</p>
      </div>
      <AppButton class="cookie-accept" @click="acknowledge">{{ $t('cookies.accept') }}</AppButton>
    </aside>
  </Transition>
</template>

<style scoped lang="stylus">
.cookie-notice
  position fixed
  z-index 1000
  right var(--spacing-4)
  bottom calc(var(--spacing-4) + env(safe-area-inset-bottom, 0px))
  left var(--spacing-4)
  display flex
  align-items center
  gap var(--spacing-4)
  max-width 760px
  margin-inline auto
  padding var(--spacing-5)
  color var(--color-text)
  background var(--color-surface)
  border 1px solid var(--color-border)
  border-radius var(--radius-xl)
  box-shadow var(--shadow-lg)

.cookie-icon
  display flex
  flex-shrink 0
  align-items center
  justify-content center
  width 52px
  height 52px
  color var(--color-primary)
  background unquote('color-mix(in srgb, var(--color-primary) 10%, transparent)')
  border-radius var(--radius-lg)

.cookie-copy
  flex 1
  min-width 0

  h2
    margin 0 0 var(--spacing-1)
    font-size var(--font-size-base)
    font-weight var(--font-weight-semibold)

  p
    margin 0
    color var(--color-text-muted)
    font-size var(--font-size-sm)
    line-height 1.6

.cookie-accept
  flex-shrink 0

.cookie-notice-enter-active
.cookie-notice-leave-active
  transition opacity 180ms ease, transform 180ms ease

.cookie-notice-enter-from
.cookie-notice-leave-to
  opacity 0
  transform translateY(12px)

@media (max-width 520px)
  .cookie-notice
    flex-wrap wrap
    gap var(--spacing-3)
    padding var(--spacing-4)

  .cookie-icon
    width 44px
    height 44px

  .cookie-copy
    flex-basis calc(100% - 56px)

  .cookie-accept
    width 100%

@media (prefers-reduced-motion reduce)
  .cookie-notice-enter-active
  .cookie-notice-leave-active
    transition none
</style>
