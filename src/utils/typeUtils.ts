/**
 * Creates a type-safe enum array from union type values
 * @param values Array of values that match the union type
 * @returns Typed array for use in Mongoose schemas
 * 
 * @example
 * ```typescript
 * const GENDER_VALUES = createEnumFromType<Gender>(['masculine', 'feminine', 'neuter']);
 * ```
 */
export function createEnumFromType<T extends string>(values: T[]): T[] {
  return values;
}
