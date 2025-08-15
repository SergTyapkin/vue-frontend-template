<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-form
  .input-container
    position relative
    margin-top 20px

    label
      display block
      text-align left
      font-large()

    .placeholder
      pointer-events none
      user-select none
      position absolute
      bottom 12px
      left 44px
      color colorText2
      text-align left
      transition all 0.2s ease
      font-medium()

    &:not(.with-image)
      .placeholder
        left 14px

    input
      all unset
      display block
      box-sizing border-box
      width 100%
      padding 10px 0 10px 40px
      border 2px solid colorBorder
      border-radius radiusM
      text-align left
      trans()
      font-medium()

      &::placeholder
        visibility hidden
        opacity 0

      &:not(:placeholder-shown) ~ label
      &:focus ~ label
        top 2px
        left 15px
        opacity 0.3

      &:not(:placeholder-shown) ~ .placeholder
        opacity 0

      &:not(:focus) ~ .placeholder
      &:not(:placeholder-shown) ~ .placeholder
        left 50px

    &:not(.with-image)
      input
        padding-left 10px

        &:not(:focus) ~ .placeholder
        &:not(:placeholder-shown) ~ .placeholder
          left 20px

    .image-hidden
    .image
      position absolute
      bottom 12px
      left 10px
      width 22px
      height 22px
    .image-hidden
      right 10px
      left unset
      hover-effect()

    .error
    .success
      pointer-events none
      user-select none
      position absolute
      right 20px
      bottom 12px
      opacity 0
      transition opacity 0.2s ease
      font-small-extra()

      &.hidden
        opacity 0
    &.hideable
      .error
      .success
        right 40px

    .error
      color colorError

    .success
      color colorSuccess

    .info
      user-select none
      margin-top 2px
      padding-left 20px
      text-align left
      opacity 0.5
      font-small-extra()

    &.error
      color colorError

      .error:not(.hidden)
        opacity 1

    &.success
      color colorSuccess

      .success:not(.hidden)
        opacity 1

  .submit
    margin 20px 0
    button-emp2()
</style>

<template>
  <div
    class="root-form"
    @keydown.enter="submit"
    @input="
      () => {
        isSubmittedAlready ? checkFormat() : null;
      }
    "
  >
    <div
      class="input-container"
      v-for="([fieldName, field], i) in Object.entries(fields)"
      :key="i"
      :class="{
        error: field.__error,
        success: field.__success,
        'with-image': field.image,
        'hideable': field.hideable,
      }"
    >
      <label :for="`${uid}-${fieldName}`">{{ field.title }}</label>

      <SelectList
        v-if="field.type === 'select'"
        :list="field.options"
        :selected-idx="field.selectedIdx"
        v-model="field.value"
      />
      <input
        v-else
        v-bind="field"
        :id="`${uid}-${fieldName}`"
        v-model="field.value"
        :type="field._isNotHidden ? 'text' : field.type || 'text'"
        :autocomplete="field.autocomplete || 'off'"
        placeholder="-"
      >

      <img v-if="field.image" :src="field.image" class="image" :alt="field.title">

      <img
        v-if="field.hideable && field._isNotHidden"
        @click="field._isNotHidden = !field._isNotHidden"
        src="/static/icons/eye-invisible.svg"
        class="image-hidden"
        alt="hide"
      >
      <img
        v-else-if="field.hideable && !field._isNotHidden"
        @click="field._isNotHidden = !field._isNotHidden"
        src="/static/icons/eye-visible.svg"
        class="image-hidden"
        alt="show"
      >

      <div v-if="field.info" class="info">{{ field.info }}</div>
      <div class="placeholder">{{ field.placeholder }}</div>
      <div class="error" :class="{ hidden: !errorSuccessShowed }">
        {{ field.overrideErrorText || field.errorText || 'Неверный формат' }}
      </div>
      <div class="success" :class="{ hidden: !errorSuccessShowed }">
        {{ field.successText || 'Успех' }}
      </div>
    </div>

    <button class="submit" @click="submit">
      <transition name="opacity" mode="out-in" duration="200">
        <CircleLoading v-if="loading" size="1.2em" light />
        <span v-else>{{ submitText || 'Отправить' }}</span>
      </transition>
    </button>
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import SelectList from "~/components/SelectList.vue";

export default {
  components: {SelectList, CircleLoading },

  props: {
    fields: {
      type: Object,
      required: true,
      default: () => ({
        some_field: {
          name: String,
          errorText: String,
          overrideErrorText: null,
          successText: String,
          value: String, // initial value
          regExp: RegExp,
          validator: Function, // (Any) => Boolean
          required: Boolean, // default: false
          noTrimValue: Boolean, // default: false. By default the return value will be trimmed

          type: String(), // default: 'text'
          placeholder: String(),
          autocomplete: String(), // default: 'off'
          hideable: Boolean, // default: false
          //other <input> attributes: String()

          options: [], // options for type = 'select'
          selectedIdx: undefined, // number for type = 'select'
        },
      }),
    },
    submitText: {
      type: String,
      default: 'Отправить',
    },
    setSuccesses: Boolean, // Can set on fields only errors
    loading: Boolean,
  },
  emits: ['success', 'error'],

  data() {
    return {
      uid: Math.random(),
      errorSuccessShowed: false,

      isSubmittedAlready: false,
    };
  },

  methods: {
    submit() {
      this.isSubmittedAlready = true;
      this.errorSuccessShowed = true;
      // setTimeout(() => this.errorSuccessShowed = false, 1000);

      if (!this.checkFormat()) {
        this.$emit('error');
        return;
      }
      const res = {};
      Object.entries(this.fields).forEach(([fieldName, field]) => {
        const fieldValueTrimmed = field.type === 'text' ? field.value.trim() : field.value;
        res[fieldName] = field.prettifyResult ? field.prettifyResult(fieldValueTrimmed) : fieldValueTrimmed;
      });
      this.$emit('success', res);
    },

    checkFormat() {
      let res = true;
      Object.values(this.fields).forEach(field => {
        field.value = field.value || '';
        const validationText =
          field.type === 'text' ? (field.noTrimValue ? field.value : field.value.trim()) : field.value;
        if (field.validationRegExp) {
          field.__error = !field.validationRegExp.test(validationText);
        } else if (field.validator) {
          field.__error = !field.validator(validationText);
        } else {
          field.__error = false;
        }
        if (field.__error) {
          field.overrideErrorText = null;
        }
        field.__success = this.setSuccesses && !field.__error;
        res = res && !field.__error;
      });
      return res;
    },

    __setErrorOnField(field, errorText) {
      field.__error = true;
      field.overrideErrorText = errorText;
    },
    setError(fields, errorText) {
      if (Array.isArray(fields)) {
        fields.forEach(field => this.__setErrorOnField(field, errorText));
        return;
      }
      this.__setErrorOnField(fields, errorText);
    },
  },
};
</script>
