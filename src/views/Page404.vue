<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-404
  page-root()
  .form
    max-width 600px
    margin 20px auto
    padding 20px
    padding-top 10px
    border-radius radiusM
    color colorText1
    text-align center
    background-color colorBg
    .title
      font-large()

      margin-bottom 10px
    .info
      font-medium()

      margin-bottom 15px
</style>

<template>
  <div class="root-404">
    <div class="form">
      <div class="title">404 Страница не найдена</div>
      <div class="info">Запрошенной страницы не существует</div>
      <router-link :to="{ name: 'default' }" />
    </div>
  </div>
</template>

<script>
export default {};
</script>
