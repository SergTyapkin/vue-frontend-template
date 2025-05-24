<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-footer
  margin-top 100px
  color colorText1
  background colorBlockBgEmp1Gradient

  .top-row
    page-root()

    display flex
    gap 10px
    justify-content space-between
    padding-top 40px
    padding-bottom 20px

    .column
      display flex
      flex-direction column

      > *:not(header)
        font-small-extra()
        font-thin()
        hover-effect()

        padding 4px 0

      .logo
        width 150px

        @media ({mobile})
          width 75px

      header
        font-large()

  .bottom-row
    border-top 1px solid colorEmp2
    .bottom-row-inner
      page-root()
      font-small()

      display flex
      gap 40px
      padding-top 10px
      padding-bottom 10px

      > *:not(.languages)
        hover-effect()

      .languages
        button
          button-no-styles()
          hover-effect()

          padding-right 10px
</style>

<template>
  <footer class="root-footer">
    <section class="top-row">
      <router-link :to="{ name: 'default' }" class="column">
        <img class="logo" src="/static/icons/telegram-logo.svg" alt="logo">
      </router-link>

      <section class="column">
        <header>Партнеры</header>
        <a href="#" target="_blank">Партнер</a>
        <a href="#" target="_blank">Партнер</a>
        <a href="#" target="_blank">Партнер</a>
        <a href="#" target="_blank">Партнер</a>
      </section>

      <section class="column">
        <header>Меню</header>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
      </section>

      <section class="column">
        <header>Списки</header>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
        <router-link :to="{ name: 'default' }">Раздел</router-link>
      </section>
    </section>

    <section class="bottom-row">
      <div class="bottom-row-inner">
        <div class="languages">
          <button>RU</button>
          <button>ENG</button>
          <button>AR</button>
          <button>ZH</button>
        </div>
        <router-link :to="{ name: 'default' }">Политика конфиденциальности</router-link>
        <router-link :to="{ name: 'default' }">Настройка файлов cookie</router-link>
      </div>
    </section>
  </footer>
</template>

<script lang="ts">
export default {
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
