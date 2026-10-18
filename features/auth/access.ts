export function safeReturnTo(value: unknown): string {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !/[\\\r\n]/.test(value)
    ? value
    : '/';
}
export function hasPermissions(granted: readonly string[], required: readonly string[]): boolean {
  return required.every((permission) => granted.includes(permission));
}
