<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-confirm-email
  min-width 0
</style>

<template>
  <div class="root-confirm-email">
    Подтверждаем ваш E-mail...
    <CircleLoading />
  </div>
</template>

<script>
import CircleLoading from '~/components/loaders/CircleLoading.vue';

export default {
  components: { CircleLoading },

  data() {
    return {
      code: this.$route.query.code,
    };
  },

  async mounted() {
    const { ok } = await this.confirmEmail();
    if (ok) {
      this.$router.push({ name: 'profile' });
      return;
    }
    this.$popups.error('Ошибка', 'Неизвестная ошибка');
  },

  methods: {
    async confirmEmail() {
      if (!this.code) {
        this.$popups.error('Ошибка', 'Код для подтверждения не был передан в url');
        return;
      }

      this.$refs.form.loading = true;
      const { data, ok } = await this.$api.confirmEmailByCode(this.code);
      this.$refs.form.loading = false;

      if (!ok) {
        this.$popups.error('Не удалось подтвердить E-mail', data || 'Произошла неизвестная ошибка');
        return;
      }

      this.$popups.success('Подтверждено', 'Теперь ваш E-mail подтверждён');

      this.$refs.form.loading = true;
      await this.$store.dispatch('GET_USER');
      this.$refs.form.loading = false;
    },
  },
};
</script>
