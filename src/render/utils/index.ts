/**
 * 根据最小值和最大值生成随机数
 * @param min 最小值
 * @param max 最大值
 * @returns number
 */
 export const getRandom = (min: number, max: number) => {
  const dec = max - min
  return Math.floor(Math.random() * dec + min)
}