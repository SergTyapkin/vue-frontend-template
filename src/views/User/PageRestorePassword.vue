<style lang="stylus" scoped></style>

<template>
  <div class="root-restore-password">
    <div v-if="!code">
      <h1>Восстановление пароля</h1>
      <input v-model="email" placeholder="email">
      <button @click="sendRestorePasswordEmail">Выслать письмо</button>
    </div>
    <div v-else>
      <h1>Установить новый пароль</h1>
      <input v-model="newPassword" placeholder="Пароль">
      <input v-model="newPasswordConfirm" placeholder="Подтверждение">
      <button @click="restorePassword">Сменить пароль</button>
    </div>

    <router-link :to="{ name: 'login' }" class="link">Войти как нормальный человек</router-link>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      code: this.$route.query.code,
      emailSent: false,
      email: '',
      newPassword: '',
      newPasswordConfirm: '',
    };
  },

  methods: {
    validatePasswords(password, passwordConfirm) {
      let ok = true;
      if (password.length === 0) {
        this.$refs.formPassword.errors.password = 'Пароль не может быть пустым';
        ok = false;
      }
      if (password !== passwordConfirm) {
        this.$refs.formPassword.errors.password = 'Пароли не совпадают';
        this.$refs.formPassword.errors.passwordConfirm = 'Пароли не совпадают';
        ok = false;
      }
      return ok;
    },

    async sendRestorePasswordEmail() {
      this.$refs.formEmail.loading = true;
      const response = await this.$api.sendRestorePasswordEmail(this.email);
      this.$refs.formEmail.loading = false;

      if (response.ok_) {
        this.$popups.success('Отправлено', 'Письмо для восстановления пароля выслано на вашу почту');
        this.emailSent = true;
        return;
      }

      if (response.status_ === 404) {
        this.$refs.formEmail.errors.email = 'Этот email не зарегистрирован';
        this.$refs.formEmail.showError();
        return;
      }

      this.$popups.error('Не удалось выслать письмо', response.info || 'Произошла неизвестная ошибка');
    },

    async restorePassword() {
      if (!this.validatePasswords(this.newPassword, this.newPasswordConfirm)) return;

      this.$refs.formPassword.loading = true;
      const response = await this.$api.restorePassword(this.code, this.newPassword);
      this.$refs.formPassword.loading = false;

      if (!response.ok_) {
        this.$popups.error('Не удалось изменить пароль', response.info || 'Произошла неизвестная ошибка');
        return;
      }

      this.$popups.success('Пароль изменен!');
      this.$refs.formPassword.errors = {};
      this.$router.push({ name: 'login' });
    },
  },
};
</script>
