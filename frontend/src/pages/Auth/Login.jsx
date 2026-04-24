import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './auth.scss'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { login as loginApi } from '@/api/auth.api'
import { useAuth } from '../../store/auth.store'

const Login = () => {

  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }

  const { login, isReady, isAuthed } = useAuth()

  const [form, setForm] = useState({
    email: "",
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSumit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) {
      setError('이메일을 입력해주세요')
      return
    }
    if (!form.password.trim()) {
      setError('비밀번호를 입력해주세요')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const data = await loginApi({
        email: form.email.trim(),
        password: form.password
      })

      login(data)
      navigate('/app')

    } catch (error) {
      setError(error.message || '로그인을 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="landing">
      <div className="landing-bg">
        <div className="t-bg">
          <div className="auth-box">
            <nav>
              <h2>로그인</h2>
              <Button
                text="뒤로가기"
                backico='wh'
                className="back"
                onClick={handleBack} />
            </nav>
            <form className='auth-form' onSubmit={handleSumit}>
              <div className="form-group">

                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  />
                <Input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  />
              </div>
              <div className="auth-btn-wrap">
                <Button text="로그인" type="submit" className="primary" />
              </div>
            </form>
            <div className="auth-bt">
              {error && <p className='error-text'> {error}</p>}
              <div className='auth-now'>
                <span>계정이 없으신가요?</span>
                <Link to="/signup">
                  <Button text="회원가입하기" tColor='bl' />
                  
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login