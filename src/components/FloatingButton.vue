<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/utils.styl'

padding = 5px

float-button-height = 50px
image-width = 30px
.float-button
  cursor pointer
  position fixed
  z-index 10
  right 30px
  bottom 30px
  overflow hidden
  min-width float-button-height
  height float-button-height
  padding padding
  padding-right ((float-button-height - image-width) / 2)
  background empColor2_2
  box-shadow 3px 3px 5px colorShadow

  .fields
    display flex
    flex-direction row
    align-items center
    justify-content flex-end
    height 100%
    text-align center
    transition all 0.2s ease
    .image
      width image-width
      height image-width
      opacity 0.8
      transition all 0.2s ease
    .hover-text
      pointer-events none
      overflow hidden
      width 0
      opacity 0
      transition all 0.2s ease

  @media ({mobile})
    right 20px
  border-radius((float-button-height / 2))
.float-button:hover
  box-shadow 5px 5px 8px colorShadow
  .hover-text
    width 120px
    opacity 1
  .image
    transform scale(1.1)
    opacity 1

.float-button.green
  background mix(colorSuccess, black, 70%)


@media ({mobile})
  .float-button
    transition opacity 0.3s ease, right 0.3s ease !important
</style>

<template>
  <div class="float-button" :class="{ green }">
    <router-link v-if="to" class="fields" :to="to">
      <span class="hover-text">{{ title }}</span>
      <span class="image">
        <slot />
      </span>
    </router-link>

    <div v-else class="fields">
      <span class="hover-text">{{ title }}</span>
      <span class="image">
        <slot />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: undefined,
    },
    to: {
      type: String,
      default: undefined,
    },
    green: Boolean,
  },
};
</script>
