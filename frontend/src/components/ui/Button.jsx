import React from 'react'
import './Button.scss'
const Button = ({
  type="button",
    text,
    className="",
    onClick=null,
    tColor="wh"
}) => {
  return (
    <button type={type} className={`btn ${className} ${tColor}`} onClick={onClick} >
        {text}
    </button>
  )
}

export default Button