import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { Form, Field } from 'vee-validate';
import { NInput } from 'naive-ui';
import { z } from 'zod';
import { it, expect, vi } from 'vitest';
import { formSchema, fieldErrors } from '../../shared/validation/schema';
it('supports Zod 4 sync and async validation through a typed vee schema', async () => {
  const schema = formSchema(
    z.object({
      code: z
        .string()
        .min(2)
        .refine(async (value) => value !== 'xx', 'Unavailable'),
    }),
  );
  expect((await schema.parse({ code: '' })).errors[0]?.path).toBe('code');
  expect((await schema.parse({ code: 'xx' })).errors[0]?.errors).toContain('Unavailable');
  expect((await schema.parse({ code: 'ok' })).value).toEqual({ code: 'ok' });
});
it('integrates declarative Form and Field with an Options API component', async () => {
  const submit = vi.fn();
  const Fixture = defineComponent({
    components: { VeeForm: Form, Field, NInput },
    data: () => ({ schema: formSchema(z.object({ code: z.string().min(2) })) }),
    methods: { submit },
    template:
      '<VeeForm :validation-schema="schema" @submit="submit"><Field name="code" v-slot="{ field, errorMessage }"><NInput :value="field.value" @update:value="field.onChange" @blur="field.onBlur" /><span>{{ errorMessage }}</span></Field><button>Submit</button></VeeForm>',
  });
  const wrapper = mount(Fixture);
  await wrapper.get('input').setValue('ok');
  await wrapper.get('form').trigger('submit');
  await flushPromises();
  await vi.waitFor(() => expect(submit).toHaveBeenCalled());
  expect(submit.mock.calls[0]?.[0]).toEqual({ code: 'ok' });
});
it('maps FastAPI field errors', () => {
  expect(fieldErrors({ detail: [{ loc: ['body', 'email'], msg: 'Invalid' }] })).toEqual({
    email: 'Invalid',
  });
  expect(fieldErrors(null)).toEqual({});
});
