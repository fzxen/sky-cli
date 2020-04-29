/**
 * * 获取变量类型
 */

type VariableType =
  | 'map'
  | 'set'
  | 'array'
  | 'object'
  | 'number'
  | 'string'
  | 'boolean'
  | 'undefined'
  | 'null'
  | 'symbol'
  | 'bigint';

/**
 * @description 获取变量类型
 * @author fanzhongxu
 * @param {any} variable 变量
 * @returns 类型
 */
export default function(variable: unknown): VariableType {
  const result = Object.prototype.toString
    .call(variable)
    .match(/\s(\w*)]$/)?.[1]
    .toLowerCase();

  return result as VariableType; // eslint-disable-line
}
