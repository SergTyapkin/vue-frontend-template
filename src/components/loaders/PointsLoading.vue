<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.circle-loading
  position relative
  width calc(var(--size) / 4)
  height calc(var(--size) / 4)
  margin-top calc(var(--size) / 4 * 1.5)
  margin-bottom calc(var(--size) / 4 * 1.5)
  border-radius 50%
  color colorEmp1
  animation opacity-in 0.4s linear forwards, fill 1s ease-in infinite alternate
  &::before
  &::after
    content ''
    position absolute
    top 0
    left calc(var(--size) / 4 * 1.5)
    width 100%
    height 100%
    border-radius 50%
    animation fill 0.9s ease-in infinite alternate

  &::after
    right calc(var(--size) / 4 * 1.5)
    left auto
    animation-duration 1.1s

  @keyframes opacity-in
    0%
      opacity 0
    100%
      opacity 1

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
