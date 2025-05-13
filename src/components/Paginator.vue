<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

paginator-button()
  button-no-styles()
  font-small()

  border-radius radiusM

.root-paginator
  user-select none
  display flex
  gap 20px
  min-width 0

  .button-show-more
    paginator-button()

    padding 5px 10px
    color colorTextLight1
    background colorEmp1
    trans()
    &:hover
      color colorText1
      background colorBlockBgSelected

  .pages-list
    list-no-styles()
    block-shadow()

    display flex
    padding 0
    background colorBlockBg
    border-radius radiusM

    > *
      width 30px
      padding 5px 0
      color colorEmp1
      background colorBlockBg
      paginator-button()
      centered-flex-container()
      trans()

      &.page
        &:hover
          background colorBlockBgSelected
        &.selected
          color colorTextLight1
          background colorEmp1

</style>

<template>
  <section class="root-paginator" v-if="maxPagesCount > 1">
    <button v-if="canShowMore" class="button-show-more">Показать ещё</button>

    <ul class="pages-list" v-if="maxPagesCount <= pagesCountShown + 1">
      <li class="page" v-for="i in maxPagesCount" @click="select(i)" :class="{ selected: i === modelValue }">
        {{ i }}
      </li>
    </ul>
    <ul class="pages-list" v-else-if="modelValue <= pagesCountShown - 1">
      <li class="page" v-for="i in pagesCountShown" @click="select(i)" :class="{ selected: i === modelValue }">
        {{ i }}
      </li>
      <li>...</li>
      <li class="page" @click="select(maxPagesCount)">{{ maxPagesCount }}</li>
    </ul>
    <ul class="pages-list" v-else-if="modelValue >= maxPagesCount - pagesCountShown + 2">
      <li class="page" @click="select(1)">{{ 1 }}</li>
      <li>...</li>
      <li
        class="page"
        v-for="i in pagesCountShown"
        @click="select(maxPagesCount - pagesCountShown + i)"
        :class="{ selected: (maxPagesCount - pagesCountShown + i) === modelValue }"
      >
        {{ maxPagesCount - pagesCountShown + i }}
      </li>
    </ul>
    <ul class="pages-list" v-else>
      <li class="page" @click="select(1)">{{ 1 }}</li>
      <li>...</li>
      <li
        class="page"
        v-for="i in pagesCountShown - 2"
        @click="select(modelValue - Math.round(pagesCountShown / 2) + 1 + i)"
        :class="{ selected: modelValue - Math.round(pagesCountShown / 2) + 1 + i === modelValue }"
      >
        {{ modelValue - Math.round(pagesCountShown / 2) + 1 + i }}
      </li>
      <li>...</li>
      <li class="page" @click="select(maxPagesCount)">{{ maxPagesCount }}</li>
    </ul>
  </section>
</template>

<script lang="ts">
export default {
  emits: ['update:modelValue', 'change'],

  props: {
    canShowMore: Boolean,
    pagesCountShown: {
      type: Number,
      default: 5,
    },
    maxPagesCount: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
    };
  },

  mounted() {},

  methods: {
    select(pageNumber: number) {
      this.$emit('update:modelValue', pageNumber);
      this.$emit('change', pageNumber);
    },
  },
};
</script>
