<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

borderWidth = 3px

.circle-loading
  position relative
  box-sizing border-box
  width 'calc(var(--size) - %s)' % borderWidth
  height 'calc(var(--size) - %s)' % borderWidth
  border borderWidth solid colorBlockBg
  border-radius 50%
  animation opacity-in 0.4s linear forwards, rotation 1s linear infinite
  &::after
    content ''
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    box-sizing border-box
    width var(--size)
    height var(--size)
    border borderWidth solid
    border-color colorEmp1 transparent
    border-radius 50%

  @keyframes opacity-in
    0%
      opacity 0
    100%
      opacity 1

  @keyframes rotation
    0%
      transform rotate(0)
    100%
      transform rotate(360deg)
</style>

<template>
  <div class="circle-loading" :style="{ '--size': size }" :class="{centered}" />
</template>

<script lang="ts">
export default {
  props: {
    size: {
      type: String,
      default: '40px',
    },
    centered: Boolean,
  },
};
</script>
