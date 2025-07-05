import { createRuntimeFn } from './runtime/createRuntimeFn';
import { mergeProperties } from './mergeProperties';
import type { AtomicProperties, SprinklesFn } from './types';

/**
 * Creates a Sprinkles function from multiple property definitions.
 * This version includes a check to prevent duplicate property names across multiple defineProperties configs.
 */
export function createSprinkles(
  ...configs: Array<AtomicProperties>
): SprinklesFn {
  // 👇 Added logic to track duplicate property names
  const usedProperties = new Set<string>();

  for (const config of configs) {
    for (const property of Object.keys(config.properties)) {
      if (usedProperties.has(property)) {
        throw new Error(
          `Duplicate property "${property}" found in multiple defineProperties() calls. Please ensure all properties are uniquely defined.`
        );
      }
      usedProperties.add(property);
    }
  }

  const merged = mergeProperties(...configs);

  return createRuntimeFn(merged);
}
