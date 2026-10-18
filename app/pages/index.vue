<script lang="ts">
import { defineComponent } from 'vue';
import site from '../../site.config';
import { definePageMeta } from '../../shared/lib/page-meta';
definePageMeta({ public: true });
export default defineComponent({ name: 'HomePage', data: () => ({ site }) });
</script>
<template>
  <AppContainer>
    <header class="header"><a class="brand" href="/" :aria-label="site.name"><img :src="site.branding.logo" alt="" width="34" height="34">{{ site.name }}</a><nav :aria-label="$t('preferences')"><LocaleSwitch /><ThemeSwitch /></nav></header>
    <main id="main-content">
      <AppSection class="hero">
        <span class="eyebrow"><span class="dot" />{{ $t('eyebrow') }}</span>
        <AppHeading as="h1" variant="display">{{ $t('headline') }}<br><span class="accent">{{ $t('headlineAccent') }}</span></AppHeading>
        <AppText class="intro">{{ site.description[$i18n.locale as 'ru' | 'en'] }}</AppText>
        <AppStack direction="row" class="actions"><AppButton href="#foundation">{{ $t('start') }}<AppIcon name="lucide:arrow-up-right" /></AppButton><span class="quiet">{{ $t('yours') }}</span></AppStack>
        <div class="canvas" aria-hidden="true"><div class="orbit orbit-one" /><div class="orbit orbit-two" /><div class="tile"><AppIcon name="lucide:layers-3" size="48" /></div><span class="canvas-label">{{ site.shortName }} / 01</span><span class="canvas-cross">+</span></div>
      </AppSection>
      <AppSection id="foundation" class="foundation"><div class="section-label">{{ $t('foundation') }}</div><AppGrid :columns="3"><AppCard v-for="item in ['fast', 'considered', 'open']" :key="item"><AppIcon :name="({ fast: 'lucide:zap', considered: 'lucide:scan', open: 'lucide:move-up-right' })[item] || 'lucide:circle'" /><AppHeading as="h2" variant="heading-3">{{ $t(`${item}.title`) }}</AppHeading><AppText muted>{{ $t(`${item}.text`) }}</AppText></AppCard></AppGrid></AppSection>
    </main>
    <footer><span>© {{ site.name }}</span><span>{{ $t('footer') }}</span></footer>
  </AppContainer>
</template>
<style scoped lang="stylus">
.header
  display flex
  align-items center
  justify-content space-between
  padding var(--spacing-7) 0
.brand
  display inline-flex
  align-items center
  gap var(--spacing-3)
  color var(--color-text)
  font-weight 700
  font-size 23px
  text-decoration none
nav
  display flex
  align-items center
  gap var(--spacing-5)
.hero
  position relative
  padding 100px 0 120px
  overflow hidden
.eyebrow
  display inline-flex
  align-items center
  gap var(--spacing-2)
  margin-bottom var(--spacing-6)
  color var(--color-text-muted)
  font-size var(--font-size-sm)
.dot
  width 7px
  height 7px
  border-radius 50%
  background var(--color-primary)
.accent
  color var(--color-primary)
.hero .display
  max-width 62%
  font-size clamp(40px, 4.2vw, 56px)
.intro
  max-width 380px
  margin-top var(--spacing-6)
  color var(--color-text-muted)
  font-size var(--font-size-lg)
.actions
  margin-top var(--spacing-8)
.quiet
  color var(--color-text-muted)
  font-size var(--font-size-sm)
.canvas
  position absolute
  top 50px
  right 0
  width 37%
  height 390px
  border 1px solid var(--color-border)
  border-radius var(--radius-xl)
  background unquote('radial-gradient(ellipse at center, color-mix(in srgb, var(--color-primary) 15%, transparent), transparent 70%)')
  overflow hidden
.orbit
  position absolute
  top 50%
  left 50%
  width 270px
  height 270px
  border 1px solid unquote('color-mix(in srgb, var(--color-primary) 25%, transparent)')
  border-radius 50%
  transform translate(-50%, -50%) rotate(-30deg) scaleX(0.65)
.orbit-two
  transform translate(-50%, -50%) rotate(45deg) scaleX(0.65)
.tile
  position absolute
  top 50%
  left 50%
  display grid
  place-items center
  width 120px
  height 120px
  border 1px solid var(--color-border)
  border-radius 28px
  color var(--color-primary)
  background var(--color-surface)
  box-shadow var(--shadow-lg)
  transform translate(-50%, -50%) rotate(-12deg)
.canvas-label
  position absolute
  bottom var(--spacing-5)
  left var(--spacing-5)
  color var(--color-text-muted)
  font-size var(--font-size-xs)
  letter-spacing 0.1em
.canvas-cross
  position absolute
  top var(--spacing-4)
  right var(--spacing-5)
  color var(--color-text-muted)
.section-label
  margin-bottom var(--spacing-5)
  color var(--color-text-muted)
  font-size var(--font-size-xs)
  letter-spacing 0.1em
  text-transform uppercase
.foundation
  padding-top 0
footer
  display flex
  justify-content space-between
  gap var(--spacing-4)
  border-top 1px solid var(--color-border)
  padding var(--spacing-7) 0
  color var(--color-text-muted)
  font-size var(--font-size-sm)

@media (max-width 900px)
  .hero .display
    max-width 100%
  .canvas
    display none
  .hero
    padding 65px 0 80px

@media (max-width 520px)
  nav
    gap var(--spacing-3)
  footer
    flex-direction column
</style>
