<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-change-password
  page-root()
</style>

<template>
  <div class="root-change-password">
    <article class="form">
      <header>СМЕНА ПАРОЛЯ</header>

      <FormWithErrors
        ref="form"
        :fields="fields"
        submit-text="Сменить пароль"
        :loading="loading"
        @success="changePassword"
      />

      <router-link class="profile-link" :to="{ name: 'profile' }">
        <button class="profile-button">Назад</button>
      </router-link>
    </article>
  </div>
</template>

<script>
import FormWithErrors from '~/components/FormWithErrors.vue';
import Validators from '~/utils/validators';

export default {
  components: { FormWithErrors },
  data() {
    return {
      fields: {
        oldPassword: {
          title: 'Старый пароль',
          name: 'password',
          type: 'password',
          placeholder: '●●●●●●',
          validationRegExp: Validators.password.regExp,
          prettifyResult: Validators.password.prettifyResult,
          autocomplete: 'password',
        },
        newPassword: {
          title: 'Новый пароль',
          name: 'new-password',
          type: 'password',
          placeholder: '●●●●●●',
          validationRegExp: Validators.password.regExp,
          prettifyResult: Validators.password.prettifyResult,
        },
        newPasswordAgain: {
          title: 'Новый пароль ещё раз',
          name: 'new-password',
          type: 'password',
          placeholder: '●●●●●●',
          validationRegExp: Validators.password.regExp,
          prettifyResult: Validators.password.prettifyResult,
        },
      },
      loading: false,
    };
  },

  methods: {
    async changePassword(data) {
      if (data.newPassword !== data.newPasswordAgain) {
        this.$refs.form.setError([this.fields.newPassword, this.fields.newPasswordAgain], 'Пароли не совпадают');
        return;
      }

      this.loading = true;
      const { ok } = await this.$api.changePassword(data.oldPassword, data.newPassword);
      this.loading = false;

      if (!ok) {
        this.$refs.form.setError(this.fields.oldPassword, 'Неверный пароль');
        return;
      }
      this.$popups.success('Пароль изменен', 'Пароль умпешно изменен');

      this.loading = true;
      await this.$store.dispatch('GET_USER');
      this.loading = false;
      this.$router.push({ name: 'profile' });
    },
  },
};
</script>
