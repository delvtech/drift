import type { AnyObject, Extended, ReplaceProps } from "src/utils/types";

/**
 * Extends an object instance with additional properties, returning a new object
 * that maintains the prototype chain of the original instance.
 */
export function extendInstance<
  T extends AnyObject,
  const U extends Partial<T> & Partial<Extended<T>>,
>(
  instance: T,
  // extension: AnyObject extends U ? U : Omit<U, keyof T> & Partial<T>,
  extension: U,
): ReplaceProps<T, U> {
  return Object.assign(
    Object.create(Object.getPrototypeOf(instance)),
    instance,
    extension,
  );
}
