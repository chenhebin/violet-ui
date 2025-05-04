import { createContext } from 'react'
import type { FormInstance } from '../interface'
// 设置初始form实例上下文
const FormContext = createContext<FormInstance | null>(null)

export default FormContext
