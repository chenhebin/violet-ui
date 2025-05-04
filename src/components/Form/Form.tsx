import React, { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'
import { useForm } from './hook/useForm'
import FormContext from './hook/FormContext'
import type { FormProps } from './interface'

// FormProps限制form的props入参结构
// forwardRef范型规定第一个为dom类型，第二个是接受到的组件prop类型
const Form: React.FC<FormProps> = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const {
    form,
    children,
    onFinish,
    onFinishFailed,
    initialValues,
    ...restProps
  } = props
  const [ formInstance ] = useForm(form) // 仓库实例获取

  // 储存成功/失败 cb
  formInstance.setCallbacks({ onFinish, onFinishFailed })

  // 暴露 ref
  const formRef = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => formRef.current as HTMLFormElement);

  // 初始化默认值
  const mountRef = useRef(false)
  formInstance.setInitialValues(initialValues, !mountRef.current)
  if (!mountRef.current) {
    mountRef.current = true
  }

  // 处理提交
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    event.stopPropagation();
    formInstance.submit()
  }
  return (
    <FormContext.Provider value={formInstance}>
      <form onSubmit={handleSubmit} {...restProps} ref={formRef}>{children}</form>
    </FormContext.Provider>
  )
})

export default Form
