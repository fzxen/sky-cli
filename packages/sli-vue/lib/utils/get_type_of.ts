/**
 * * 获取变量类型

 */

/**
 * @description 获取变量类型
 * @author fanzhongxu
 * @param {any} variable 变量
 * @returns 类型
 */
export default function(variable: unknown): string {
  const result = Object.prototype.toString
    .call(variable)
    .match(/\s(\w*)]$/)?.[1]
    .toLowerCase();

  return result || '';
}
