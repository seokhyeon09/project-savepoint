import React, { useState } from 'react'
import './Signup.scss'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/auth.store'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Signup = () => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: ''
  })
  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = {
    
  }


  return (
    <section className="landing">
      <div className="landing-bg">
        <div className="t-bg">
          <div className="auth-box">
            <nav>
              <h2>회원가입</h2>
              <Button
                text="뒤로가기"
                backico='wh'
                className="back"
                onClick={handleBack} />
            </nav>
            <form className='auth-form'>
              <div className="form-group" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="이메일을 입력하세요"
                  onChange={handleChange} />
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="비밀번호를 입력하세요"
                  onChange={handleChange} />
                <Input
                  type="password"
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  placeholder="패스워드를 한번 더 입력하세요"
                  onChange={handleChange} />
                <Input
                  type="phone"
                  name="phone"
                  value={form.phone}
                  placeholder="전화번호를 입력하세요"
                  onChange={handleChange} />
              </div>
              {/* {error && <p className='error-text'> {error}</p>} */}
              <div className="auth-btn-wrap">
                <Button
                  // text={isLoading ? "가입 중..." : "회원가입"}
                  text="회원가입"
                  type="submit"
                  className="primary" />
              </div>
            </form>
            <div className="auth-now">
              <span>이미 계정이 있으신가요?</span>
              <Link to="/login">
                <Button text="로그인하기" icons />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup