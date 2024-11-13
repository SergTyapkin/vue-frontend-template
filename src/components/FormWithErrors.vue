<style lang="stylus" scoped>
@import '../styles/buttons.styl'
@import '../styles/constants.styl'
@import '../styles/fonts.styl'

border-color = colorText1
input-border = 2px solid border-color

.root-form
  .input-container
    position relative
    padding-top 12px

    label
    .placeholder
      pointer-events none
      user-select none
      position absolute
      top 22px
      left 10px
      padding-left 10px
      text-align left
      opacity 0.5
      transition all 0.2s ease
      font-medium()
    label
      opacity 1

    input
      all unset
      display block
      box-sizing border-box
      width 100%
      padding-top 10px
      padding-bottom 10px
      padding-left 17px
      text-align left
      border input-border
      border-top-width 0
      border-radius borderRadiusL
      outline input-border
      outline-offset -2px
      transition all 0.2s ease, background-size 0.1s ease
      font-medium()
      &::placeholder
        visibility hidden
        opacity 0
      &:focus
      &:not(:placeholder-shown)
        outline-color transparent
        outline-offset 5px
      &:not(:placeholder-shown) ~ label
      &:focus ~ label
        top 2px
        left 15px
        opacity 0.3
      &:not(:focus) ~ .placeholder
      &:not(:placeholder-shown) ~ .placeholder
        left 40px
        opacity 0

    .error
    .success
      pointer-events none
      user-select none
      position absolute
      top 26px
      right 20px
      opacity 0
      transition opacity 0.2s ease
      font-small-extra()
      &.hidden
        opacity 0
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
    button-submit()

    margin-top 10px
    margin-bottom 10px
</style>

<template>
  <div class="root-form" @keydown.enter="submit" @input="() => {isSubmittedAlready ? checkFormat() : null}">
    <div
      class="input-container"
      v-for="([fieldName, field], i) in Object.entries(fields)"
      :key="i"
      :class="{ error: field.__error, success: field.__success }"
    >
      <input
        v-bind="field"
        :id="`${uid}-${fieldName}`"
        v-model="field.value"
        :type="field.type || 'text'"
        :autocomplete="field.autocomplete || 'off'"
        placeholder="-"
      >
      <label :for="`${uid}-${fieldName}`">{{ field.title }}</label>
      <div v-if="field.info" class="info">
        {{ field.info }}
      </div>
      <div class="placeholder">
        {{ field.placeholder }}
      </div>
      <div class="error" :class="{ hidden: !errorSuccessShowed }">
        {{ field.overrideErrorText || field.errorText || 'Неверный формат' }}
      </div>
      <div class="success" :class="{ hidden: !errorSuccessShowed }">
        {{ field.successText || 'Успех' }}
      </div>
    </div>

    <button class="submit" @click="submit">
      <transition name="opacity" mode="out-in" duration="200">
        <CircleLoading v-if="loading" size="1.2em" />
        <span v-else>{{ submitText || 'Отправить' }}</span>
      </transition>
    </button>
  </div>
</template>

<script>
import CircleLoading from '~/components/loaders/CircleLoading.vue';

export default {
  components: { CircleLoading },

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
          //other <input> attributes: String()
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
