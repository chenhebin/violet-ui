import React from "react";
import './App.css' // 新增这行全局引入
import ViButton from "./components/Button/Button";
const App = () => {
    const test = () => {
        console.log('点击了按钮')
    }
    return (
        <div className={"container"}>
            <h1 className={'title'}>🚀 Hello from Violet UI</h1>
            <ViButton onClick={test}>
                点击我
            </ViButton>
        </div>
    )
}

export default App;