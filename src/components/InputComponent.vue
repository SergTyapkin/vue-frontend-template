<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/buttons.styl'
@import '../styles/components.styl'
@import '../styles/scrollbars.styl'

.input-root
  .title
    font-small()

    color colorText2
    trans()

  .description
    font-small-extra()

    font-style italic
    color colorText4
    trans()

  .input-container
    position relative

    input
    textarea
      input-no-styles()
      font-small()
      font-spaced()

      width 100%
      margin-bottom 3px
      padding 10px
      color colorText1
      border-bottom 2px solid colorBorder
      trans()

      &::placeholder
        font-spaced()
        font-small-extra()

        font-style italic
        color colorText2

    textarea
      resize none

    .images-container
      position absolute
      right 0
      top 0
      .image-hidden
        cursor pointer
        padding-block calc(10px + 0.1em)
        height 0.8em
        box-sizing content-box
        trans()

        &:hover
          opacity 0.6

    &.hideable
    &.with-icon
      input
        padding-right calc(1em + 10px)
    &.hideable.with-icon
      input
        padding-right calc(2em + 15px)


  .bottom-container
    display flex
    gap 5px
    justify-content space-between
    font-style italic
    color colorText2
    font-small-extra()

    .bottom-description
      min-width 0

    .keys-count
      trans()

  &.error
    .title
    .description
    input
    .keys-count
      color colorError

  &.success
    .title
    .description
    input
    .keys-count
      color colorSuccess
</style>

<template>
  <section class="input-root" :class="{error, success}">
    <header class="title" v-if="title">{{ title }}</header>
    <p v-if="description" class="description">{{ description }}</p>

    <div
      class="input-container"
      :class="{hideable}"
      @input="onInput"
    >
      <input
        v-model="value"
        v-if="!maxSymbols || maxSymbols < 48"
        :placeholder="placeholder"
        :type="(isHidden && hideable) ? 'password' : (type || 'text')"
        :autocomplete="autocomplete || 'off'"
      >
      <textarea v-model="value" rows="4" v-else :placeholder="placeholder" />

      <div class="images-container">
        <img v-if="icon" :src="icon" class="image" :alt="title">

        <img
          v-if="hideable && !isHidden"
          @click="isHidden = !isHidden"
          src="/static/icons/hidden.svg"
          class="image-hidden"
          alt="hide"
        >
        <img
          v-else-if="hideable && isHidden"
          @click="isHidden = !isHidden"
          src="/static/icons/visible.svg"
          class="image-hidden"
          alt="show"
        >
      </div>
    </div>

    <div class="bottom-container">
      <p class="bottom-description">{{ bottomDescription }}</p>
      <span class="keys-count" v-if="maxSymbols">{{ modelValue.length }}<span v-if="maxSymbols">/{{ maxSymbols }}</span></span>
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';

export default {
  emits: ['update:modelValue', 'input'],

  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    bottomDescription: {
      type: String,
      default: '',
    },
    maxSymbols: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    icon: {
      type: Object as PropType<string | undefined>,
      default: undefined,
    },
    modelValue: {
      type: String,
      required: true,
    },
    error: Boolean,
    success: Boolean,
    hideable: Boolean,
    hiddenByDefault: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      value: this.modelValue,
      isHidden: this.$props.hiddenByDefault,
    };
  },

  methods: {
    onInput() {
      if (this.maxSymbols) {
        this.value = this.value.slice(0, this.maxSymbols);
      }
      this.$emit('update:modelValue', this.value);
      this.$emit('input');
    },
  },

  watch: {
    modelValue() {
      this.value = this.modelValue;
    },
  },
};
</script>
