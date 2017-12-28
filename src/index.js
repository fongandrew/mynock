/**
 * Name for stubbing / mocking functions to target for replacement. This is
 * normally a symbol, but in cases where the environment or test library
 * doesn't support this, set the MYNOCK_STRING_CALLEE environment variable
 * to something truthy.
 */
export const callee = process.env.MYNOCK_SYMBOL_CALLEE ?
  Symbol('Current "active" behavior for function') :
  '__mynock_callee__';

/**
 * Wraps a function so that its behavior can be stubbed
 * @param {Function} fn
 * @param {String} [name]
 * @returns {Function}
 */
export default function wrap(fn, name) {
  if (process.env.NODE_ENV !== 'production') {
    function caller() {
      return caller[callee].apply(this, arguments);
    }
    caller[callee] = fn;
    caller.prototype = fn.prototype;
    Object.setPrototypeOf(caller, fn);
    if (name) {
      Object.defineProperty(caller, 'name', { value: name });
    }
    return caller;
  }
  return fn;
}
