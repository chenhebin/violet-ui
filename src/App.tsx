import React from "react";
import './App.css' // 新增这行全局引入
import styles from './App.css'

const App = () => {
    return (
        <div className={"container"}>
            <h1 className={styles.title}>🚀 Hello from Violet UI</h1>
        </div>
    )
}

export default App;