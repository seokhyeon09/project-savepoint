import React from 'react'
import './Button.scss'
const Button = ({
  type="button",
    text,
    className="",
    onClick=null
}) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick} >
        {text}
    </button>
  )
}

export default Button