import {useRef} from 'react'
import {allPromiseFinish} from '../../../utils/promiseUtils'
import type {FieldEntity, FormInstance, Store} from '../interface'

export class FormStore {
  // 仓库数据源
  private store: Store = {}
  // item实例方法
  private fieldEntities: FieldEntity[] = []
  // 校验cb
  private callbacks: {
    onFinish?: (values: Store) => void;
    onFinishFailed?: (errors: any[]) => void;
  } = {}
  // 定义初始值变量
  private initialValues = {};

  // 子item依赖收集
  registerField = (field: FieldEntity) => {
    this.fieldEntities.push(field)
    // 返回删除依赖方法
    return () => {
      this.fieldEntities = this.fieldEntities.filter(f => f !== field)
      delete this.store[field.name]
    }
  }
  getFieldsValue = () => ({...this.store})
  // 根据name获取value
  getFieldValue = (name: string) => this.store[name]
  setFieldValue = (name: string, value: any) => {
    const _prevStore = {...this.store}
    this.store[name] = value
    // 定制通知触发更新的dom校验
    this.notifyObservers([name], _prevStore)
  }
  setFieldsValue = (newStore: Store) => {
    const _prevStore = {...this.store}
    console.log('setFieldsValue', newStore)
    this.store = {...this.store, ...newStore}
    const _updateList = Object.keys(newStore)
    this.notifyObservers(_updateList, _prevStore)
  }
  notifyObservers = (nameList: Array<string>, preStore: Store) => {
    this.fieldEntities.forEach(field => {
      if (nameList.includes(field.name)) field.onStoreChange(preStore, this.getFieldsValue())
    })
  }
  // 设置回调
  setCallbacks = (callbacks: {
    onFinish?: (values: Store) => void,
    onFinishFailed?: (errors: any[]) => void
  }) => {
    this.callbacks = callbacks
  }

  // 校验
  validateFields = async (nameList: Array<string> = []) => {
    const promiseList: Promise<any>[] = [] // 校验result

    this.fieldEntities.forEach((field) => {
      const { name, rules } = field
      if ((rules && rules.length) && nameList.includes(field.name)) {
        const promise = field.validateRules()
        promiseList.push(
          promise
            .then(res => ({ name, errors: res })) // 成功就空数组返回即可
            .catch((errors:any) =>
              Promise.reject({
                name: [name],
                errors,
              }),
            ), // 失败信息储存
        )
      }
    })
    const summaryPromise = allPromiseFinish(promiseList);
    return summaryPromise
      .then(
        () => {
          return Promise.resolve(this.getFieldsValue());
        },
      )
      .catch((results) => {
        // 合并后的promise如果是reject状态就返回错误结果
        const errorList = results.filter((result: any) => result && result.errors.length);
        return Promise.reject({
          values: this.getFieldsValue(),
          errorFields: errorList
        });
      });
  }
  // 设置初始值
  setInitialValues = (initialValues: Store, init: Boolean) => {
    this.initialValues = initialValues // 备份
    // this.notifyObservers(Object.keys(initialValues))
    if (init) {
      this.store = {...this.initialValues}
    }
  }
  // 提交
  submit = () => {
    const { fieldEntities } = this
    const { onFinish, onFinishFailed } = this.callbacks
    this.validateFields(fieldEntities.map(i => i.name)).then(values => {
      try {
        onFinish?.(values)
      } catch (e) {
        console.log('have unknown error', e)
      }
    }).catch(errors => {
      onFinishFailed?.(errors)
    })
  }
  // 获取form方法
  getForm = (): FormInstance => ({
    setCallbacks: this.setCallbacks,
    registerField: this.registerField,
    setFieldValue: this.setFieldValue,
    setFieldsValue: this.setFieldsValue,
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setInitialValues: this.setInitialValues,
    validateFields: this.validateFields,
    submit: this.submit
  })
}

// set form实例，储存在ref中（change不会引起刷新）
export const useForm = (form?: FormInstance): [FormInstance] => {
  const formRef = useRef<FormInstance>(null)
  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      const store = new FormStore()
      formRef.current = store.getForm()
    }
  }
  return [formRef.current]
}
