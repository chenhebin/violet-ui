import React from 'react'
import './style/index.css'

export interface ViInputProps {
    placeholder: string,
    label?: string,
    value: string | number,
    onBlur?: () => void
}

const ViInput: React.FC<ViInputProps> = ({ onBlur, placeholder, value, label }) => {
    return (
        <div>
            <span>{label}</span>
            <input className={'violet-input'} onBlur={onBlur} placeholder={placeholder} value={value}>
            </input>
        </div>
    )
}
export default ViInput
