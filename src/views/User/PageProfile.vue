<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-profile
  page-root()
</style>

<template>
  <div class="root-profile">
    <div class="content-block">
      <header class="header">ПРОФИЛЬ</header>
      <div class="box user-block">
        <div class="user-name-row">
          <div class="user-name-id-block">
            <div class="user-name">{{ $user.username }}</div>
            <div class="user-id">#{{ String($user.id || '').padStart(4, '0') }}</div>
          </div>
          <button class="copy-id-button" @click="copyToClipboard($user.id, 'Твоё ID')">
            <img src="../../../static/icons/copy.svg" alt="">
          </button>

          <CircleLoading v-if="loadingProfile" size="30px" light />
          <button v-else class="button-edit" @click="changeUserParam('name')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Email:</div>
          <div class="data">{{ $user.email }}</div>
          <button class="button-edit" @click="changeUserParam('email')">Изменить</button>
        </div>
        <div class="data-row">
          <div class="field">Разрешения:</div>
          <div class="data">{{ $user.role }}</div>
          <button class="button-edit" @click="changeUserParam('role', 'phone')">Изменить</button>
        </div>

        <div class="buttons-row">
          <router-link :to="{ name: 'changePassword' }">
            <button class="change-password">Сменить пароль</button>
          </router-link>

          <button class="logout-button" @click="logout">Выйти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import Validators from '~/utils/validators';

export default {
  components: { CircleLoading },

  data() {
    return {
      loadingProfile: false,
    };
  },

  async mounted() {},

  methods: {
    async changeUserParam(fieldName, fieldNameUser = fieldName, overrideHavingValue = null) {
      const newUserData = {
        name: this.$user.name,
        group: this.$user.group,
        telegram: this.$user.tg,
        vk: this.$user.vk,
        email: this.$user.email,
        phone_number: this.$user.phone,
      };
      const inputValue = await this.$modals.prompt(
        overrideHavingValue ? 'Неверный формат' : 'Изменить значение поля',
        'Введите новое значение',
        overrideHavingValue || newUserData[fieldName],
      );
      if (!inputValue) {
        return;
      }
      if (!Validators[fieldNameUser].validate(inputValue)) {
        this.changeUserParam(fieldName, fieldNameUser, inputValue);
        return;
      }

      newUserData[fieldName] = Validators[fieldNameUser].prettifyResult(inputValue);
      this.loadingProfile = true;
      const { ok } = await this.$api.editProfile(
        newUserData.name,
        newUserData.group,
        newUserData.telegram,
        newUserData.vk,
        newUserData.email,
        newUserData.phone_number,
      );
      this.loadingProfile = false;
      if (!ok) {
        this.$popups.error(`Не удалось изменить значение поля ${fieldName}`);
        return;
      }
      this.$user[fieldNameUser] = newUserData[fieldName];
    },

    async logout() {
      this.loadingProfile = true;
      const { ok } = await this.$api.logout();
      this.loadingProfile = true;

      if (!ok) {
        this.$popups.error('Не получилось выйти из аккаунта', 'Неизвестная ошибка');
        return;
      }
      this.$store.dispatch('DELETE_USER');
      this.$router.push({ name: 'login' });
    },

    copyToClipboard(str, description) {
      navigator.clipboard.writeText(str);
      this.$popups.success('Скопировано', `${description} скопировано в буфер обмена`);
    },
  },
};
</script>
