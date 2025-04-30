import React from "react";
import './App.css' // 新增这行全局引入
import ViButton from "./components/Button/Button";
import ViInput from "./components/Input/Input";
const App = () => {
    const test = () => {
        console.log('点击了按钮')
    }
    return (
        <div className={"container"}>
            <h1 className={'title'}>🚀 Hello from Violet UI</h1>
            <ViInput
                label={'名字：'}
                placeholder={'请输入内容'}
                value={'这是默认值'}
            />
            <ViButton onClick={test}>
                点击我
            </ViButton>
        </div>
    )
}

export default App;