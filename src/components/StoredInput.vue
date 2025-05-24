<template>
  <InputComponent
    :max-symbols="maxSymbols"
    :disabled="disabled"
    :error="error"
    v-model="modelValue"
    :title="title"
    :type="type"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<script lang="ts">
import {PropType} from "vue";
import InputComponent from "~/components/InputComponent.vue";

export default {
  components: {InputComponent},
  emits: ['update:modelValue'],

  props: {
    title: {
      type: String,
      default: '',
    },
    maxSymbols: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: String,
      required: true,
    },
    uniqueName: {
      type: String,
      required: true,
    },
    disabled: Boolean,
    error: Boolean,
  },

  mounted() {
    const savedData = localStorage.getItem(this.uniqueName);
    if (savedData !== null) {
      this.$emit('update:modelValue', savedData);
    }
  },

  methods: {
    clearStoredValue() {
      localStorage.removeItem(this.uniqueName);
    },
    onInput() {
      localStorage.setItem(this.uniqueName, this.modelValue);
      console.log(this.uniqueName, this.modelValue)
      this.$emit('update:modelValue', this.modelValue);
    }
  },
};
</script>
