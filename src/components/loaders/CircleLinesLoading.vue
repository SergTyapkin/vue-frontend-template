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
  width 'calc(var(--size) - %s)' % borderWidth
  height 'calc(var(--size) - %s)' % borderWidth
  border borderWidth solid colorBlockBg
  border-radius 50%
  position relative
  box-sizing border-box
  animation rotation 1s linear infinite
  &::after
    content ''
    box-sizing border-box
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    width var(--size)
    height var(--size)
    border-radius 50%
    border borderWidth solid
    border-color colorEmp1 transparent

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
