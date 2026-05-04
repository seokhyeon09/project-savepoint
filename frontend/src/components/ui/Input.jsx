import React from 'react'
import './Input.scss'

const Input = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  ...rest }) => {
  return (
    <div className='input-group'>
      <div className="input-wrapper">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='input-field'
          {...rest} />
      </div>
    </div>
  )
}

export default Input