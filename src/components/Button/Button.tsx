import React from 'react'
import './style/index.css'

export interface ViButtonProps {
    children: React.ReactNode
    onClick: () => void
}

const ViButton: React.FC<ViButtonProps> = ({ children, onClick }) => {
    return (
        <button className={'violet-btn'} onClick={onClick}>
            {children}
        </button>
    )
}
export default ViButton
