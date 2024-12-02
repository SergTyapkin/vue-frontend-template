<style lang="stylus" scoped>
@import 'styles/constants.styl'
@import 'styles/buttons.styl'
@import 'styles/fonts.styl'

.wrapper
  width 100%
  min-height 100vh

  > *
    position absolute
    width 100%
    min-height 100vh
</style>

<style lang="stylus">
@keyframes scale-out
  from
    transform scale(1)
    opacity 1

  to
    transform scale(0.95)
    opacity 0


@keyframes scale-in
  0%
    transform scale(1.05)
    opacity 0

  25%
    transform scale(1.05)
    opacity 0

  100%
    transform scale(1)
    opacity 1


.scale-in-enter-active
  overflow hidden
  animation scale-in 0.2s ease

.scale-in-leave-active
  overflow hidden
  animation scale-out 0.2s ease


.opacity-enter-active
  animation opacity 0.3s

.opacity-leave-active
  animation opacity 0.3s reverse forwards


@keyframes opacity
  0%
    opacity 0

  100%
    opacity 1
</style>

<template>
  <div class="wrapper">
    <router-view #default="{ Component }">
      <transition name="scale-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <Popups ref="popups" />
  <Modals ref="modals" />
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Modals, Popups } from '@sergtyapkin/modals-popups';
import API from '~/utils/API';

export default {
  components: { Modals, Popups },

  data(): {
    transitionName: string;
    global?: Record<string, any>;
  } {
    return {
      transitionName: '',
      global: undefined,
    };
  },

  mounted() {
    this.global = getCurrentInstance()!.appContext.config.globalProperties;

    this.global.$user = this.$store.state.user;
    this.global.$modal = this.$refs.modals;
    this.global.$popups = this.$refs.popups;
    this.global.$app = this;
    this.global.$api = new API(`/api`);

    this.checkMobileScreen();
    window.addEventListener('resize', () => {
      this.checkMobileScreen();
    });
  },

  methods: {
    checkMobileScreen() {
      if (window.innerWidth <= 700) {
        this.global!.$isMobile = true;
        return;
      }
      this.global!.$isMobile = false;
    },
  },

  watch: {
    $route(to, from) {
      this.transitionName = 'scale-in';

      console.log(from.path, 'TO', to.path);
    },
  },
};
</script>
