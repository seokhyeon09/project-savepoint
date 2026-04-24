import React from 'react'
import Button from '../ui/Button'
import './Header.scss'

const Header = () => {
  return (
    <div className="header">
      <div className="header-logo"><img src="./assets/logo-wh.svg" alt="logo" /></div>
      <div className="header-loginout">
        <Button text="로그아웃" className="back"/>
      </div>
    </div>
  )
}

export default Header