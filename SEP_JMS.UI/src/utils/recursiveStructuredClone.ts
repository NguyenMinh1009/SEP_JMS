export const recursiveStructuredClone = <T>(obj: T): T => {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return primitive values directly
  }

  if (Array.isArray(obj)) {
    return obj.map(item => recursiveStructuredClone(item)) as T; // Clone arrays
  }

  if (obj instanceof Date) {
    return new Date(obj) as T; // Clone dates
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as T; // Clone regular expressions
  }

  if (obj instanceof Map) {
    const clonedMap = new Map();
    obj.forEach((value, key) => {
      clonedMap.set(key, recursiveStructuredClone(value)); // Clone maps
    });
    return clonedMap as T;
  }

  if (obj instanceof Set) {
    const clonedSet = new Set();
    obj.forEach(value => {
      clonedSet.add(recursiveStructuredClone(value)); // Clone sets
    });
    return clonedSet as T;
  }

  // Clone plain objects
  const clonedObj: any = {};
  Object.keys(obj).forEach(key => {
    clonedObj[key] = recursiveStructuredClone((obj as any)[key]);
  });
  return clonedObj as T;
};
