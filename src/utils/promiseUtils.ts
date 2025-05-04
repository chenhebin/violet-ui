/**
 * @description promiseList 中只要有一个是 rejected 状态，那么输出的promise 就应该是 reject 状态
 * @param promiseList
 */
export const allPromiseFinish = async (promiseList: Array<Promise<any>>): Promise<any> => {
  let _result = []
  for (const promise of promiseList) {
    try {
      const _tmp = await promise
      _result.push(_tmp)
    } catch (e) {
      _result.push(e)
    }
  }
  // 存在err就rej
  if (_result.length && _result.some((i: any) => (i.errors && i.errors.length))) {
    return Promise.reject(_result)
  }
  // 否则就是校验成功
  return Promise.resolve(_result)

}
