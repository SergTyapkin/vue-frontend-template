<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/components.styl'

range-empty-background = colorBg
range-fill-background = colorEmp1


range-width = 7px
splitters-background = mix(colorEmp1, white, 80%)
splitters-labels-color = colorEmp1
thumb-width = 25px

.slider-container
  font-small-extra()
  --percent calc(var(--percent-number) * 100%)

  user-select none
  position relative
  display flex
  gap 15px
  align-items center
  padding-top 1.1lh

  .value
    font-medium()

    all unset
    display block
    box-sizing border-box
    width 60px
    padding 5px 8px
    color colorBg
    text-align center
    -moz-appearance textfield
    -webkit-appearance textfield
    appearance textfield
    background colorSec1
    border-radius radiusMax

    &::-webkit-outer-spin-button
    &::-webkit-inner-spin-button
      display none

  .title
    position absolute
    font-small-extra()

    top 0

  .input-container
    position relative
    flex 1

    .range
      all unset
      cursor pointer
      // overflow hidden
      width 100%
      height range-width
      background linear-gradient(to right, range-fill-background 50%, range-empty-background 50%)
      background-position-x calc(100% - var(--percent))
      background-size 200% 100%
      border-radius radiusMax
      trans(0.1s)

      &::-webkit-slider-thumb
        cursor pointer
        width thumb-width
        height thumb-width
        -webkit-appearance none
        background transparent
        border none
        border-radius radiusMax
        outline none

    .range-thumb
      pointer-events none
      position absolute
      top -0.2lh
      left 'calc(var(--percent-number) * (100% - %s))' % thumb-width
      transform translateX(-50%)
      display flex
      align-items center
      justify-content center
      width thumb-width
      height thumb-width
      margin-left (thumb-width / 2)
      color colorTextInvert1
      background colorEmp1
      // background transparent
      border none
      border-radius radiusMax
      outline none
      trans(0.1s)

    .range-labels
      position absolute
      bottom 0
      left 0
      width 100%
      color splitters-labels-color
      font-small-extra()

      > *
        cursor pointer
        position absolute
        top 5px
        left 'calc((var(--i) - 1) / var(--labels-count) * (100% - %s))' % thumb-width
        transform translate(-50%, -50%)
        margin-left (thumb-width / 2)
        padding 5px
        transition all 0.1s ease

        &:hover
          top 7px
          color colorText1

    .splitters-container
      pointer-events none
      position absolute
      bottom 0
      width 100%

      .splitter
        position absolute
        bottom 3px
        left 'calc((var(--i) - 1) / var(--labels-count) * (100% - %s))' % thumb-width
        width 2px
        height range-width
        margin-left (thumb-width / 2)
        background splitters-background

  &.disabled
  &.readonly
    pointer-events none

  &.disabled
    .value
    .input-container
      opacity 0.4
      filter saturate(0)
  &.no-value
    .input-container
      .range
        background range-empty-background
      .range-thumb
      .value
        opacity 0
</style>

<template>
  <div
    class="slider-container"
    :class="{ disabled, readonly, 'no-value': !isFinite(modelValue) }"
    :style="{
      '--labels-count': labelsCount,
      '--value': modelValue,
      '--min': min,
      '--max': max,
      '--percent-number': (modelValue || 0 - min) / (max - min),
    }"
  >
    <input
      v-show="!noValue"
      type="number"
      aria-controls="off"
      ref="value"
      class="value"
      v-model="modelValue"
      :step="step"
      @change="updateVModel"
      :disabled="readonly || disabled"
    >

    <header class="title" v-if="title">{{ title }}</header>
    <div class="input-container">
      <input
        type="range"
        class="range"
        ref="range"
        :min="min"
        :max="max"
        :step="step"
        v-model="modelValue"
        @input="updateVModel"
        :disabled="readonly || disabled"
      >

      <section class="range-labels" v-if="!noLabels">
        <div v-for="i in labelsCount + 1" @click="setModelValue(Math.round(min + (i - 1) * labelsStep))" :style="{ '--i': i }">
          {{ Math.round(min + (i - 1) * labelsStep) }}
        </div>
      </section>

      <section class="splitters-container" v-if="!noSplitters">
        <div class="splitter" v-for="i in labelsCount - 1" :style="{ '--i': i }" />
      </section>

      <div class="range-thumb">
        {{ modelValue }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  emits: ['change', 'update:modelValue'],

  props: {
    title: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
    },
    labelsCount: {
      type: Number,
      default: 10,
    },
    noValue: Boolean,
    noLabels: Boolean,
    noSplitters: Boolean,
    readonly: Boolean,
    disabled: Boolean,

    modelValue: {
      type: Number,
      required: true,
    },
  },

  computed: {
    labelsStep(): number {
      return (this.max - this.min) / this.labelsCount;
    },
  },

  methods: {
    updateVModel(event: InputEvent) {
      if (this.readonly || this.disabled) {
        return;
      }
      let value = Number((event.target as HTMLInputElement).value);
      this.$emit('update:modelValue', value);
      this.$emit('change');
    },

    setModelValue(value: number) {
      if (this.readonly || this.disabled) {
        return;
      }
      if (this.$refs.value) {
        (this.$refs.value as HTMLInputElement).value = String(value);
        (this.$refs.value as HTMLInputElement).dispatchEvent(new Event('input'));
      }
      this.$emit('update:modelValue', value);
      this.$emit('change');
    },
  },
};
</script>
