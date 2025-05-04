import FormContext from './hook/FormContext';
import type {FieldProps, Store} from './interface'

import RawAsyncValidator from 'async-validator'
import React, {useContext, useEffect, useState} from "react";

/**
 * 表单字段组件
 * @param name
 * @param children
 * @param shouldUpdate
 * @param rules
 * @constructor
 */
const Field: React.FC<FieldProps> = ({name, children, shouldUpdate, rules}) => {
  // form实例
  const form = useContext(FormContext)
  // field value to show
  const [value, setValue] = useState(() => form?.getFieldValue(name) ?? '')
  // error info
  const [errors, setErrors] = useState<Array<string>>([])
  // check is validated
  const [validatePromise, setValidatePromise] = useState<Promise<string[]> | null >(null)

  /**
   * 监听store变化，更新value
   * @param prevStore
   * @param nextStore
   */
  const onStoreChange = (prevStore: Store, nextStore: Store) => {
    const _renderFn = () => {
      setValue(form?.getFieldValue(name) ?? '')
      validateRules().catch(e => e)
    }
    // 用户手动更新渲染
    if (Object.prototype.toString.call(shouldUpdate) === '[object Function]') {
      shouldUpdate && shouldUpdate(prevStore, nextStore) && _renderFn()
    } else {
      _renderFn()
    }
  }
  /**
   *  注册到仓库，监听store变化，更新value
   */
  useEffect(() => {
    const unregister = form?.registerField({
      name,
      rules,
      onStoreChange,
      validateRules
    })
    return () => unregister?.()
  }, [form, name]);

  /**
   * async-validator校验器
   * @param name
   * @param value
   * @param rule
   */
  const validateRule = async (name: any, value: any, rule: any) => {
    const validator = new RawAsyncValidator({[name]: rule})
    let _result = []
    try {
      await Promise.resolve(validator.validate({[name]: value}))
    } catch (e: any) {
      if (e && e.errors) {
        _result = e.errors.map((c: any) => c.message)
      }
    }
    return _result
  }
  /**
   * 依次校验rules每一条，一有错误就返回错误信息，不继续校验
   * @param namePath
   * @param value
   * @param rules
   */
  const executeValidate = async (namePath: string, value: any, rules: any[]): Promise<string[]> => {
    for (const rule of rules) {
      const errorsItem = await validateRule(namePath, value, rule);
      if (errorsItem.length) {
        return Promise.reject(errorsItem); // 一旦有错误，立即停止并返回
      }
    }
    return []; // 如果所有规则都通过，返回空数组
  };
  /**
   * 触发校验
   */
  const validateRules = async () => {
    const _rules = rules || []
    let _errors: string[] = []
    const currentValue = form?.getFieldValue(name)
    const rootPromise: Promise<string[]> = (async () => {
      try {
        _errors = await executeValidate(name, currentValue, _rules)
      } catch (e: any) {
        if (Array.isArray(e)) {
          _errors = e
          setErrors(_errors)
        }
        else if (typeof e === 'string') _errors = [e]
        else _errors = ['unknown error!']
        return Promise.reject(_errors)
      }
      return _errors
    })()
    setValidatePromise(rootPromise)
    return rootPromise
  }
  /**
   * 受控组件prop劫持
   */
  const getControlled = () => {
    return {
      value,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        form?.setFieldValue(name, newValue)
        // console.log('change:', name, form?.getFieldsValue(), value)
      }
    }
  }

  /**
   * 获取error信息
   */
  const getMetaInfo = () => {
    return {
      name,
      errors,
      validated: validatePromise !== null
    };
  };
  return <>
    {children(getControlled(), getMetaInfo())}
  </>
}

export default Field
