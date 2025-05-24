<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-filters
  .header-row
    display flex
    justify-content space-between
    header
      font-large()

      display flex
      gap 10px
      align-items center
      .name
        margin-right 15px
        padding 10px 0
      .button-defaults
        button-no-fill()

  .fields
    .fields-row
      display flex
      flex-wrap wrap
      gap 16px
      align-items center
      margin-bottom 10px
      .field
        flex var(--size)
        header
          margin-bottom 5px
</style>

<template>
  <div class="root-filters">
    <div class="header-row">
      <header v-if="!noHeader">
        <span class="name">{{ title }}</span>
        <transition name="opacity">
          <button v-if="isFiltersChanged" class="button-defaults" @click="dropFilters">
            <img src="/static/icons/cross.svg" alt="">
            Сбросить
          </button>
        </transition>
      </header>
      <slot />
    </div>

    <section class="fields">
      <div class="fields-row" v-for="fieldsRow in fields">
        <div class="field" v-for="field in fieldsRow" :style="{ '--size': field.size || '1' }">
          <header v-if="hasNames">{{ field.name || '&nbsp;' }}</header>
          <SelectList
            v-if="field.type === FieldTypes.select"
            :key="fieldsUpdatingKey"
            :list="field.options"
            :placeholder="field.placeholder"
            v-model="field._value"
            :can-be-null="field.canBeNull"
            @input="
              onChange();
              onInput();
            "
          />
          <InputSearch
            v-else-if="field.type === FieldTypes.search"
            :key="fieldsUpdatingKey"
            :placeholder="field.placeholder || 'Поиск'"
            v-model="field._value"
            @change="onChange"
            @input="onInput"
          />
          <InputComponent
            unique-name="key"
            :key="fieldsUpdatingKey"
            v-else-if="field.type === FieldTypes.text"
            :placeholder="field.placeholder || ''"
            v-model="field._value"
            @change="onChange"
            @input="onInput"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import SelectList from '~/components/SelectList.vue';
import InputComponent from '~/components/InputComponent.vue';
import InputSearch from '~/components/InputSearch.vue';

const FieldTypes = {
  select: 'select',
  search: 'search',
  text: 'text',
};
export type Filter = {
  name?: string;
  key: string;
  type: keyof typeof FieldTypes;
  placeholder: string;
  size: number;
  _value?: string;
  compareFoo: (tableRow: object, filterValue: any, allFilters: { [key: string]: any }) => boolean;

  canBeNull?: boolean;
  options?: { name: string; id?: string; value: any }[];
};

export default {
  components: { InputSearch, InputComponent, SelectList },
  emits: ['update:modelValue', 'change', 'input'],

  props: {
    fields: {
      type: Array as PropType<Filter[][]>,
      required: true,
    },
    data: {
      type: Array as PropType<object[]>,
      required: true,
    },
    title: {
      type: String,
      default: 'Фильтр',
    },
    modelValue: {
      type: Array,
      required: true,
    },
    noHeader: Boolean,
  },

  data() {
    return {
      isFiltersChanged: false,
      hasNames: false,
      fieldsUpdatingKey: {},

      FieldTypes,
    };
  },

  mounted() {
    // @ts-expect-error use modelValue to ignore vue warnings
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.modelValue;

    this.updateModelValue(this.getFieldsValues());
  },

  methods: {
    updateModelValue(filters: { [key: string]: any }) {
      this.updateFiltersMeta();
      this.$emit(
        'update:modelValue',
        this.data.filter(row => {
          return !this.fields
            .flat()
            .some(
              (filter: Filter) =>
                filters[filter.key] !== undefined &&
                filter.compareFoo &&
                !filter.compareFoo(row, filters[filter.key], filters),
            );
        }),
      );
    },

    updateFiltersMeta() {
      this.hasNames = this.fields.some(row => row.some(filter => filter.name !== undefined));
      this.isFiltersChanged = this.fields.some(row => row.some(filter => filter._value !== undefined));
    },

    getFieldsValues(): { [key: string]: string | undefined } {
      const res = {} as { [key: string]: string | undefined };
      this.fields.forEach(fields => fields.forEach(field => (res[field.key] = field._value)));
      this.updateFiltersMeta();
      return res;
    },

    onChange() {
      const filters = this.getFieldsValues();
      this.$emit('change', filters);
    },

    onInput() {
      const filters = this.getFieldsValues();
      this.$emit('input', filters);
      this.updateModelValue(filters);
    },

    dropFilters() {
      this.fields.forEach(fields => fields.forEach(field => (field._value = undefined)));
      this.fieldsUpdatingKey = {};
      this.onChange();
      this.onInput();
    },
  },

  watch: {
    data() {
      const filters = this.getFieldsValues();
      this.updateModelValue(filters);
    },
  },
};
</script>
