import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './auth.scss'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { login as loginApi, redirectToKakaoLogin } from '@/api/auth.api'
import { useAuth } from '../../store/auth.store'

const Login = () => {
  const navigate = useNavigate()
  const handleBack = () => navigate(-1)

  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isKakaoLoading, setIsKakaoLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) { setError('이메일을 입력해주세요'); return }
    if (!form.password.trim()) { setError('비밀번호를 입력해주세요'); return }

    try {
      setIsLoading(true)
      setError('')
      const data = await loginApi({ email: form.email.trim(), password: form.password })
      login(data)
      navigate('/app')
    } catch (err) {
      setError(err.message || '로그인을 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    try {
      setIsKakaoLoading(true)
      await redirectToKakaoLogin()
      // 리다이렉트 되므로 이후 코드는 실행되지 않음
    } catch (err) {
      setError(err.message || '카카오 로그인 연결에 실패했습니다.')
      setIsKakaoLoading(false)
    }
  }

  return (
    <section className="landing">
      <div className="landing-bg">
        <div className="t-bg">
          <div className="auth-box">
            <nav>
              <h2>로그인</h2>
              <Button text="뒤로가기" backico='wh' className="back" onClick={handleBack} />
            </nav>

            <form className='auth-form' onSubmit={handleSubmit}>
              <div className="form-group">
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="login"
                  placeholder="이메일을 입력하세요"
                />
                <Input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  className="login"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <div className="auth-btn-wrap">
                <Button text={isLoading ? '로그인 중...' : '로그인'} type="submit" className="primary" />
              </div>
            </form>

            {/* 구분선 */}
            <div className="auth-divider">
              <span>또는</span>
            </div>

            {/* 카카오 로그인 버튼 */}
            <div className="auth-btn-wrap">
              <button
                type="button"
                className="kakao-login-btn"
                onClick={handleKakaoLogin}
                disabled={isKakaoLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C6.477 3 2 6.582 2 11c0 2.82 1.7 5.3 4.3 6.85L5.2 21l4.05-2.12c.9.25 1.8.37 2.75.37 5.523 0 10-3.582 10-8S17.523 3 12 3z" fill="#3A1D1D"/>
                </svg>
                {isKakaoLoading ? '연결 중...' : '카카오로 로그인'}
              </button>
            </div>

            <div className="auth-bt">
              {error && <p className='error-text'>{error}</p>}
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