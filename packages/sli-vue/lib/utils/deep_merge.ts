/**
 * * 深合并
 * * 对象、map对应key合并
 * * 数组、set，=> concat
 */

import getTypeof from './get_type_of';

interface Target {
  [prop: string]: unknown;
}

const isArray = (p: unknown): p is unknown[] => {
  return getTypeof(p) === 'array';
};

const isObject = (p: unknown): p is Target => {
  return getTypeof(p) === 'object';
};

const isMap = (p: unknown): p is Map<string, unknown> => {
  return getTypeof(p) === 'map';
};

const isSet = (p: unknown): p is Set<unknown> => {
  return getTypeof(p) === 'set';
};

const merger = {
  mergeArray<T>(a: T[], b: T[]): void {
    a.splice(a.length, b.length, ...b);
  },
  mergeSet(a: Set<unknown>, b: Set<unknown>): void {
    b.forEach(e => a.add(e));
  },
  mergeMap(a: Map<string, unknown>, b: Map<string, unknown>): void {
    b.forEach((value, key) => {
      if (isArray(value)) {
        !a.has(key) && a.set(key, []);
        this.mergeArray(a.get(key) as unknown[], value);
      } else if (isObject(value)) {
        !a.has(key) && a.set(key, {});
        this.mergeObject(a.get(key) as Target, value);
      } else if (isMap(value)) {
        !a.has(key) && a.set(key, new Map());
        this.mergeMap(a.get(key) as Map<string, unknown>, value);
      } else if (isSet(value)) {
        !a.has(key) && a.set(key, new Set());
        this.mergeSet(a.get(key) as Set<unknown>, value);
      } else {
        a.set(key, value);
      }
    });
  },
  mergeObject(a: Target, b: Target): void {
    this['mergeArray'];
    for (const key in b) {
      if (Object.prototype.hasOwnProperty.call(b, key)) {
        const value = b[key];
        if (isArray(value)) {
          a[key] ?? (a[key] = []);
          this.mergeArray(a[key] as unknown[], value);
        } else if (isObject(value)) {
          a[key] ?? (a[key] = {});
          this.mergeObject(a[key] as Target, value);
        } else if (isMap(value)) {
          a[key] ?? (a[key] = new Map());
          this.mergeMap(a[key] as Map<string, unknown>, value);
        } else if (isSet(value)) {
          a[key] ?? (a[key] = new Set());
          this.mergeSet(a[key] as Set<unknown>, value);
        } else {
          a[key] = value;
        }
      }
    }
  },
};

const mergeElement = <T>(target: T, element: T): void => {
  if (getTypeof(target) !== getTypeof(element)) {
    throw new Error('[error]: 相同字段类型必须一致');
  } else if (isArray(element)) {
    isArray(target) && merger.mergeArray(target, element);
  } else if (isObject(element)) {
    isObject(target) && merger.mergeObject(target, element);
  } else if (isMap(element)) {
    isMap(target) && merger.mergeMap(target, element);
  } else if (isSet(element)) {
    isSet(target) && merger.mergeSet(target, element);
  } else {
    target = element;
  }
};

/**
 * @description 深合并算法
 * @param {T} target 目标对象
 * @param {...T[]} args 待合并对象
 * @returns {T} 合并结果
 */
const deepMerge = function<T>(target: T, ...args: T[]): T {
  for (const element of args) mergeElement(target, element);
  return target;
};

export default deepMerge;
