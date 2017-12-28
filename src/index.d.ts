/**
 * This is technically `string|Symbol`, but use `any` here to avoid
 * complications with using this to access the callee property of the
 * wrapped function.
 */
export const callee: any;

/**
 * Wraps a function to allow stubbing via the mynock.callee property
 * @param fn - Wrapped function we may want to stub calls to
 * @param [name] - Optional name to assign to function
 */
export default function wrap<F extends Function>(fn: F, name?: string): F;
