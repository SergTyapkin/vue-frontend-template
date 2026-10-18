export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
    public requestId?: string,
  ) {
    super(
      status === 401
        ? 'Authentication required'
        : status === 403
          ? 'Permission denied'
          : `API request failed (${status})`,
    );
    this.name = 'ApiError';
  }
}
