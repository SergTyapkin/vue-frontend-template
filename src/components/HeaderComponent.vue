<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-header
  .row-inner
    overflow-x auto
    display flex
    gap 7%
    align-items center
    justify-content space-between
    padding-top 10px
    padding-bottom 10px
    background colorBlockBgEmp1Gradient
    scrollbars-hidden()
    page-root()
    font-small()
    .left-group
      width 120px
      hover-effect()

    .center-group
      display flex
      flex 1
      gap 0
      align-items center
      justify-content space-between
      max-width 800px

      > *
        padding 5px 5px
        white-space nowrap
        background linear-gradient(colorText1, colorText1) 50% 100% / 0 1px no-repeat
        hover-effect()
        trans()

        &.router-link-active
          background-size 100% 1px

    .right-group
      display flex
      flex 1
      gap 20px
      align-items center
      justify-content space-between
      .search
        flex 1
      .profile
        hover-effect()


</style>

<template>
  <header class="root-header">
    <div class="row-inner">
      <router-link
        :to="{ name: 'default' }"
        class="left-group"
      >
        <img
          class="logo"
          src="/static/icons/telegram-logo.svg"
          alt="logo"
        >
      </router-link>
      <div class="center-group">
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
      </div>
      <div class="right-group">
        <InputSearch v-model="searchText" class="search" placeholder="Поиск по сайту" />
        <router-link :to="{ name: 'profile' }" class="profile"><img src="/static/icons/profile.svg" alt="profile"></router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import InputSearch from '~/components/InputSearch.vue';

export default {
  components: { InputSearch },

  data() {
    return {
      searchText: '',
    };
  },

  mounted() {},

  methods: {},
};
</script>
