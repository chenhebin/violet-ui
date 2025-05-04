import React, {ReactNode} from 'react'
/**
 * 定义一个用于表单字段的Props类型
 * 它包含表单字段的名称、子组件、验证规则以及更新条件
 */
export type FieldProps = {
  name: string, // 表单字段的名称
  children: (control: {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }, meta: Object) => React.ReactNode, // 一个函数类型的子组件，接收一个包含value和onChange的对象作为参数
  rules?: Array<any>, // 验证规则数组，用于校验表单字段的值
  shouldUpdate?: (prevStore: any, nextStore: any) => boolean // 一个确定是否应该更新字段值的函数，比较上一个和下一个状态
}

/**
 * 定义一个用于表单的Props类型
 * 它包含一个用于表单实例的
 * form实例、提交回调、提交失败回调、子组件、初始值等
 */
export type FormProps = {
  form?: FormInstance;
  onFinish?: (values: any) => void; // 表单提交成功回调
  onFinishFailed?: (errors: any[]) => void; // 表单提交校验失败回调
  children: ReactNode,
  initialValues?: Store,
  [any: string]: any
}

// 仓库实例
export type Store = Record<string, any>

/**
 * 定义一个用于表单字段的实体类型，包括字段名称、状态更新函数、验证规则和验证函数
 */
export type FieldEntity = {
  name: string;
  onStoreChange: (preStore: Store, nextStore: Store) => void,
  rules?: Array<any>,
  validateRules: () => Promise<string[]>
}

/**
 * 定义一个用于表单的实例类型，包括注册字段、获取字段值、设置字段值、设置初始值等方法
 */
export type FormInstance = {
  registerField: (field: FieldEntity) => () => void,
  getFieldValue: (name: string) => any;
  setFieldValue: (name: string, value: any) => void;
  setFieldsValue: (value: Store) => void;
  getFieldsValue: () => Store;
  setInitialValues: (initialValues: Store, init: Boolean) => void;
  setCallbacks: (callbacks: { onFinish?: (values: Store) => void; onFinishFailed?: (errors: any[]) => void }) => void;
  validateFields: (nameList: Array<string>) => void;
  submit: () => void;
}
