<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.circle-loading
  width calc(var(--size) / 4)
  height calc(var(--size) / 4)
  margin-top calc(var(--size) / 4 * 1.5)
  margin-bottom calc(var(--size) / 4 * 1.5)
  position relative
  border-radius 50%
  color colorEmp1
  animation fill 1s ease-in infinite alternate
  &::before
  &::after
    content ''
    position absolute
    height 100%
    width 100%
    border-radius 50%
    left calc(var(--size) / 4 * 1.5)
    top 0
    animation fill 0.9s ease-in infinite alternate

  &::after
    left auto
    right calc(var(--size) / 4 * 1.5)
    animation-duration 1.1s

  @keyframes fill
    0%
      box-shadow 0 0 0 -1px inset
    100%
      box-shadow 0 0 0 calc(var(--size) / 8) inset
</style>

<template>
  <div class="circle-loading" :style="{ '--size': size }" :class="{centered}" />
</template>

<script lang="ts">
export default {
  props: {
    size: {
      type: String,
      default: '60px',
    },
    centered: Boolean,
  },
};
</script>
