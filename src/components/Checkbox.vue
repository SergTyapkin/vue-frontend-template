<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/components.styl'

size = 25px

checked-background = colorEmp1
checked-border = 0px solid transparent

disabled-background = mix(colorEmp1, colorBg)
disabled-border = 0px solid transparent


no-checked-background = colorBg
no-checked-border = 0px solid transparent

.checkbox-container
  input
    position relative
    width size
    height size
    appearance none
    background no-checked-background
    border no-checked-border
    border-radius radiusS
    trans()
    &::after
      content ""
      position absolute
      width 0
      height 0
      background-image url("/static/icons/done-white.svg")
      background-repeat no-repeat
      background-size size size
      trans()
    &:checked
      background checked-background
      &::after
        width size
        height size
        transition 500ms
    &.disabled
      background disabled-background
      border-color #ccc
      &::after
        filter saturate(0)
    &:not(.disabled)
      cursor pointer
    &:focus-visible + .checkbox-new
      outline 3px solid orange
</style>

<template>
  <div class="checkbox-container" :class="{ disabled, readonly }">
    <input
      type="checkbox"
      ref="value"
      v-model="modelValue"
      @change="updateVModel"
      :disabled="readonly || disabled"
      :class="{disabled}"
      :id="uid"
    >
    <label :for="uid" />
  </div>
</template>

<script lang="ts">
export default {
  emits: ['change', 'update:modelValue'],

  props: {
    readonly: Boolean,
    disabled: Boolean,

    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      uid: `checkbox-${Math.random()}`,
    };
  },

  methods: {
    updateVModel(event: InputEvent) {
      if (this.readonly || this.disabled) {
        return;
      }
      let value = Boolean((event.target as HTMLInputElement).checked);
      this.setValue(value);
    },
    toggle() {
      this.setValue(!this.modelValue);
    },
    setValue(val: boolean) {
      this.$emit('update:modelValue', val);
      this.$emit('change');
    },
  },
};
</script>
