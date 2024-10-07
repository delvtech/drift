/**
 * Extends an object instance with additional properties, returning a new object
 * that maintains the prototype chain of the original instance.
 */
export function extendInstance<T, U>(instance: T, extension: U): T & U {
  return Object.assign(
    Object.create(Object.getPrototypeOf(instance)),
    instance,
    extension,
  );
}
