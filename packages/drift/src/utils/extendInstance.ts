import type { AnyObject, ReplaceProps } from "src/utils/types";

/**
 * Extends an object instance with additional properties, returning a new object
 * that maintains the prototype chain of the original instance.
 */
export function extendInstance<T, U extends AnyObject>(
  instance: T,
  extension: AnyObject extends U ? U : Omit<U, keyof T> & Partial<T>,
): ReplaceProps<T, U> {
  return Object.assign(
    Object.create(Object.getPrototypeOf(instance)),
    instance,
    extension,
  );
}
