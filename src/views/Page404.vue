<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

.root-404
  width 100%
  padding 20px
  .form
    max-width 600px
    margin 20px auto
    padding 20px
    padding-top 10px
    color colorText1
    text-align center
    background-color colorBg
    border-radius borderRadiusM
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
