import React from 'react'
import './Button.scss'
const Button = ({
    text,
    className="",
    onClick=null
}) => {
  return (
    <button className={`btn ${className}`} onClick={onClick} >
        {text}
    </button>
  )
}

export default Button