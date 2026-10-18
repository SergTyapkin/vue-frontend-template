import { z } from 'zod';
import type { TypedSchema } from 'vee-validate';
/** Declarative Form/Field components work directly in Options API SFC templates. */
export function formSchema<T extends z.ZodType>(schema: T): TypedSchema<z.input<T>, z.output<T>> {
  return {
    __type: 'VVTypedSchema',
    async parse(values) {
      const result = await schema.safeParseAsync(values);
      if (result.success) return { value: result.data, errors: [] };
      const errors = new Map<string, string[]>();
      for (const issue of result.error.issues) {
        const path = issue.path.map(String).join('.');
        errors.set(path, [...(errors.get(path) ?? []), issue.message]);
      }
      return { errors: [...errors].map(([path, errors]) => ({ path, errors })) };
    },
  };
}
export function fieldErrors(detail: unknown): Record<string, string> {
  if (
    !detail ||
    typeof detail !== 'object' ||
    !('detail' in detail) ||
    !Array.isArray(detail.detail)
  )
    return {};
  return Object.fromEntries(
    detail.detail
      .filter(
        (item): item is { loc: (string | number)[]; msg: string } =>
          item && Array.isArray(item.loc) && typeof item.msg === 'string',
      )
      .map((item) => [item.loc.filter((key) => key !== 'body').join('.'), item.msg]),
  );
}
