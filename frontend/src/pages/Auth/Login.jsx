import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './Login.scss'
import Button from '../../components/ui/Button'

const Login = () => {

  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <section className="landing">
      <div className="landing-bg">
        <div className="t-bg">
          <div className="t-wrap">
            <h2>
              <img src="/assets/logo.svg" alt="logo" className='login-logo' />
            </h2>
            로그인
            인풋로그인
            패스워드
            인풋패스워드
            <Button text="뒤로가기" onClick={handleBack} className='back' />
            <Link to="/signup">
              <Button text="회원가입하기" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login