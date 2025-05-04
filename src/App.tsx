import React from "react";
import './App.css' // 新增这行全局引入
import ViButton from "./components/Button/Button";
import ViInput from "./components/Input/Input";
import ViForm from './components/Form/index'
const App = () => {
    const test = () => {
        console.log('点击了按钮')
    }
    const [form] = ViForm.useForm()
    const formRef = React.useRef(null)

    const initialValues = {
        username: 'test name',
        password: '123123'
    }
    const onFinish = (values: any) => {
    console.log('Form Values: ', values)
    }
    const onFinishFailed = (values: any) => {
    console.log('Validation Failed: ', values)
    }
    return (
        <div className={"container"}>
            <h1 className={'title'}>🚀 Hello from Violet UI</h1>
            <br />******************************************************* ViInput *****************************************************************<br />
            <ViInput
                label={'名字：'}
                placeholder={'请输入内容'}
                value={'这是默认值'}
            />
            <br />******************************************************* ViButton *****************************************************************<br />
            <ViButton onClick={test}>
                点击我
            </ViButton>
            <br />******************************************************* ViForm *****************************************************************<br />
            <ViForm form={form} ref={formRef} initialValues={initialValues} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <ViForm.Field name="username" rules={[{ required: true, message: 'Please input username'}]}>
                    {(control: any, meta: any) => {
                        return (
                            <div>
                                <input placeholder="Username" {...control} /><br />
                                {meta.errors.length > 0 && (
                                    <span style={{ color: 'red'}}>{JSON.stringify(meta)}</span>
                                )}
                            </div>
                        )
                    }}
                </ViForm.Field>
                <button type="submit">Submit</button>
            </ViForm>
        </div>
    )
}

export default App;