<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/buttons.styl'
@import '../styles/components.styl'
@import '../styles/scrollbars.styl'

.root-input-splitted
  display flex
  gap 5px
  align-items center

  input
    input-no-styles()
    font-large()

    text-align center
    width 2em
    min-width 0
    padding 10px
    color colorText1
    border 2px solid transparent
    border-bottom-color colorText3
    caret-color transparent
    border-radius borderRadiusS
    trans()

    &::placeholder
      display none

    &:placeholder-shown
      border-color colorText4

    &:focus
      border-color colorText3
      color colorText3

  &.error
    input
      color colorError
      border-bottom-color colorError

  &.success
    input
      color colorSuccess
      border-bottom-color colorSuccess

  &.disabled
    input
      color colorText3
      background colorBlockBg
      border-bottom-color colorText4
      &:focus
        cursor not-allowed
        border-color transparent
        border-bottom-color colorText4


  .icon
    width 2em
    height 2em
    margin-left 10px
</style>

<template>
  <section class="root-input-splitted" :class="{error, success, disabled}">
    <input
      v-for="i in symbolsCount"
      :key="i"
      ref="inputs"
      class="symbol"
      readonly
      @keydown="(evt: KeyboardEvent) => onKeyDown(evt, i)"
      @input="updateModelValue"
      placeholder=" "
      @click="(evt: MouseEvent) => onClick(evt, i)"
    />

    <CircleLoading v-if="loading" class="icon"/>
    <img v-else-if="error" src="/static/icons/close-red.svg" class="icon" alt="error">
    <img v-else-if="success" src="/static/icons/done-green.svg" class="icon" alt="error">
  </section>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';

export default {
  components: { CircleLoading },
  emits: ['update:modelValue', 'input', 'finish'],

  props: {
    symbolsCount: {
      type: Number,
      required: true,
    },
    error: Boolean,
    success: Boolean,
    disabled: Boolean,
    loading: Boolean,
    modelValue: {
      type: String,
      default: '',
    }
  },

  methods: {
    onKeyDown(evt: KeyboardEvent, pos: number) {
      const inputsElements = this.$refs.inputs as HTMLInputElement[];
      if (evt.key >= '0' && evt.key <= '9') {
        inputsElements[pos - 1].value = evt.key; // set value to 1 symbol
        evt.preventDefault()
        this.updateModelValue();

        if (pos < this.symbolsCount) {
          inputsElements[pos].focus();
          return;
        }
        this.finishInput(this.getValue());
        return;

      } else if (evt.key === 'Backspace' || evt.key === 'Delete') {
        inputsElements[pos - 1].value = '';
        this.updateModelValue();
        if (pos > 1) {
          inputsElements[pos - 2].focus();
        }
        evt.preventDefault();
        return;

        // } else if (evt.key === 'Delete') {
        //   inputsElements[pos - 1].value = '';
        //   this.updateModelValue();
        //   if (pos < this.symbolsCount) {
        //     inputsElements[pos].focus();
        //   }
        //   evt.preventDefault();
        //   return;

      } else if (evt.key === 'ArrowLeft') {
        if (pos > 1) {
          inputsElements[pos - 2].focus();
        }
        evt.preventDefault()
        return;

      } else if (evt.key === 'ArrowRight') {
        if (pos < this.symbolsCount) {
          inputsElements[pos].focus();
        }
        evt.preventDefault()
        return;

      } else if (evt.key === 'Enter') {
        const val = this.getValue();
        if (val.length === this.symbolsCount) {
          this.finishInput(val);
        }
      }
    },

    onClick(evt: MouseEvent, pos: number) {
      const inputsElements = this.$refs.inputs as HTMLInputElement[];
      if (inputsElements.findIndex(el => el.value !== '') === -1) {
        evt.preventDefault();
        inputsElements[0].focus();
      }
    },

    finishInput(value: string) {
      this.$emit('finish', value);
      (this.$refs.inputs as HTMLInputElement[]).forEach(el => el.blur());
    },

    getValue() {
      return (this.$refs.inputs as HTMLInputElement[]).map(el => el.value).join('');
    },

    updateModelValue() {
      this.$emit('update:modelValue', this.getValue());
    }
  },
};
</script>
