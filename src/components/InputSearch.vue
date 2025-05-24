<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-input-with-icon
  cursor text
  display flex
  align-items center
  height 45px
  margin 0
  padding 0 15px
  border 2px solid colorBorder
  border-radius radiusM
  &:focus
    border-color colorEmp1

  .input
    input-no-styles()
    font-small()

    width 100%
    margin-right 8px
    color colorText1
    &::placeholder
      color colorText3
      font-normal()
  .icon
  .clear
    cursor pointer
    display block
    width 18px
    height 18px
</style>

<template>
  <div class="root-input-with-icon">
    <input
      class="input"
      :type="type"
      v-model="modelValue"
      @input="updateModelValue(modelValue)"
      :placeholder="placeholder"
      id="search"
      @change="$emit('change')"
    >
    <transition name="opacity" mode="out-in">
      <label v-if="!modelValue" for="search">
        <img class="icon" src="/static/icons/search.svg" alt="search">
      </label>
      <img v-else class="clear" @click="updateModelValue('')" src="/static/icons/cross.svg" alt="clear">
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['update:modelValue', 'change', 'input'],

  props: {
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },

    modelValue: {
      type: String,
      default: '',
    },
  },

  methods: {
    updateModelValue(value: string) {
      this.$emit('update:modelValue', value);
      this.$emit('input');
    }
  }
};
</script>
