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

  input
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

  .keys-count
    font-small-extra()

    width min-content
    margin-left auto
    font-style italic
    color colorText2
    trans()

  &.error
    .title
      color colorError
    input
      color colorError
    .keys-count
      color colorError
</style>

<template>
  <section class="input-root" :class="{error}">
    <div class="title" v-if="title">{{ title }}</div>
    <input v-model="value" @input="onInput" :placeholder="placeholder" :type="type">
    <div class="keys-count">{{ modelValue.length }}<span v-if="maxSymbols">/{{ maxSymbols }}</span></div>
  </section>
</template>

<script lang="ts">
import {PropType} from "vue";

export default {
  emits: ['update:modelValue', 'input'],

  props: {
    title: {
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
    modelValue: {
      type: String,
      required: true,
    },
    error: Boolean,
  },

  data() {
    return {
      value: this.modelValue,
    }
  },

  methods: {
    onInput() {
      this.$emit('update:modelValue', this.value);
      this.$emit('input');
    }
  },

  watch: {
    modelValue() {
      this.value = this.modelValue;
    }
  }
};
</script>
