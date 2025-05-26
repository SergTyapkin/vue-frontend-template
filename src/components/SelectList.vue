<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/utils.styl'
@import '../styles/fonts.styl'
@import '../styles/scrollbars.styl'

height = 45px
bg-color = colorBlockBg
bg-color-hover = mix(colorBlockBg, colorEmp1, 90%)
bg-color-selected = mix(colorBlockBg, colorEmp1, 85%)
bg-color-selected-hover = mix(colorBlockBg, colorEmp1, 90%)

item-height = 40px
max-list-height = 200px

field()
  font-small()

  cursor pointer
  display flex
  align-items center
  padding 0 15px
  transition background-color 0.1s ease


.select-root
  user-select none
  position relative
  z-index 999
  transform translateY(calc(var(--overflow-y-length) * -1px)) translateX(calc(var(--overflow-x-length) * -1px))
  min-width 100px
  height height
  margin 0
  padding 0
  transition transform 0.2s ease

  .title
    pointer-events none
    position absolute
    top -10px
    left 4px
    font-medium()

    transition all 0.2s ease

  .selected-item
    input()
    field()

    justify-content space-between
    width 100%
    height height
    color colorText1
    border 2px solid colorBorder
    &.default
      color colorText2

    &:hover
      background bg-color-selected-hover

    img
      img-size(20px)

      transition transform 0.3s ease

  .list
    block-shadow()
    scrollable()

    position absolute
    z-index 9999
    top height
    overflow-y auto
    width 100%
    max-height max-list-height
    margin 0
    padding 0
    list-style none
    border-top none
    border-radius borderRadiusM
    transition all 0.2s ease

    .item
      field()

      height item-height
      color colorText1
      background bg-color

      &.default
        color colorText2

      &.selected
        letter-spacing 1px
        background bg-color-selected

      &:hover
        background bg-color-hover

      &.selected:hover
        background bg-color-selected-hover

      &:not(:first-child)
        border-top 1px solid colorBorder

  &.unrolled
    .title
      top -16px

    .selected-item
      background bg-color-selected
      border-color colorEmp1

    img
      transform rotate(-180deg)

  &:not(.unrolled)
    .list
      max-height 0
      opacity 0

  &[readonly]:not([readonly="false"])
    pointer-events none
    user-select text

    .title
      color colorText2

    .selected-item
      padding-left 10px
      border none

      img
        display none

  &[disabled]:not([disabled="false"])
    pointer-events none
    user-select text
    opacity 0.6

    .title
      color colorText2

    .selected-item
      img
        display none
</style>

<template>
  <div
    class="select-root"
    ref="root"
    :class="{ unrolled: isUnrolled }"
    :disabled="disabled"
    :readonly="readonly"
    :style="{
      '--overflow-y-length': overflowYLength,
      '--overflow-x-length': overflowXLength,
    }"
  >
    <span class="error-text">{{ currentError }}</span>
    <div class="selected-item" @click.stop="toggleOpen" :class="{default: currentSelectedIdx === undefined}">
      {{ currentSelectedIdx !== undefined ? list[currentSelectedIdx]?.name : (placeholder || 'Не выбрано') }}
      <img src="/static/icons/chevron-down.svg" alt="chevron">
    </div>
    <ul class="list scrollable">
      <li
        v-if="canBeNull"
        class="item default"
        :class="{ selected: currentSelectedIdx === undefined }"
        @click.stop="selectItem(undefined)"
      >
        {{ placeholder || 'Не выбрано' }}
      </li>
      <li
        v-for="(item, idx) in list"
        class="item"
        :class="{ selected: idx === currentSelectedIdx }"
        @click.stop="selectItem(idx)"
      >
        {{ item.name }}
      </li>
    </ul>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";


export default {
  emits: ['input', 'update:modelValue'],

  props: {
    title: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    list: {
      type: Array as PropType<{id?: string, name: string, value: any}[]>,
      required: true,
    },
    selectedIdx: {
      type: Number,
      default: undefined,
    },
    selectedId: {
      type: Number,
      default: undefined,
    },
    disabled: Boolean,
    readonly: Boolean,
    opened: Boolean,
    canBeNull: Boolean,

    // eslint-disable-next-line vue/no-unused-properties
    modelValue: {
      type: null as any,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      States: {
        default: 0,
        success: 1,
        error: 2,
      },
      state: 0,

      currentError: this.$props.error,

      currentSelectedIdx: undefined as number | undefined,
      isUnrolled: this.$props.opened,

      overflowYLength: 0,
      overflowXLength: 0,
    };
  },

  mounted() {
    window.addEventListener('click', this.onClick);

    if (this.$props.selectedIdx !== undefined) {
      this.currentSelectedIdx = this.$props.selectedIdx;
    } else {
      this.currentSelectedIdx = this.list.findIndex(item =>
        (item.id !== undefined) &&
        (String(item.id) === String(this.$props.selectedId))
      );
      if (this.currentSelectedIdx === -1) {
        this.currentSelectedIdx = undefined;
        return;
      }
    }

    this.selectItem(this.currentSelectedIdx, true);
  },

  unmounted() {
    window.removeEventListener('click', this.onClick);
  },

  methods: {
    onClick() {
      this.isUnrolled = false;
    },

    focus() {
      this.isUnrolled = true;
    },

    selectItem(idx: number | undefined, disableEmitting = false) {
      this.state = this.States.default;
      this.currentSelectedIdx = idx;

      if (idx !== undefined) {
        this.$emit('update:modelValue', this.list[idx].value);
        if (!disableEmitting) {
          this.$emit('input', idx, this.list[idx].value);
        }
      } else {
        this.$emit('update:modelValue', undefined);
        if (!disableEmitting) {
          this.$emit('input', null, undefined);
        }
      }
      this.setClose();
    },


    toggleOpen() {
      if (!this.isUnrolled) {
        // opening list
        this.setOpen();
      } else {
        // closeList
        this.setClose();
      }
    },

    setOpen() {
      const rect = (this.$el as HTMLElement).getBoundingClientRect();
      const bottomY = rect.y + rect.height;
      const rightX = rect.x + rect.width;
      const maxHeight = window.innerHeight;
      const maxWidth = window.innerWidth;
      this.overflowYLength = Math.max(bottomY - maxHeight, 0);
      this.overflowXLength = Math.max(rightX - maxWidth, 0);
      this.isUnrolled = true;
    },
    setClose() {
      this.overflowYLength = 0;
      this.isUnrolled = false;
    },
  },

  watch: {
    list(from, to) {
      if (JSON.stringify(from) === JSON.stringify(to)) {
        return;
      }

      if (this.selectedId && this.currentSelectedIdx === undefined) {
        this.currentSelectedIdx = this.list.findIndex(item => String(item.id) === String(this.$props.selectedId));
        if (this.currentSelectedIdx === -1) {
          this.currentSelectedIdx = undefined;
          return;
        }
      }

      this.selectItem(this.currentSelectedIdx, true);
    },
  },
};
</script>
