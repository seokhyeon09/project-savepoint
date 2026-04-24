import React, { useState } from 'react'
import './auth.scss'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/auth.store'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { signup } from '@/api/auth.api'

const Signup = () => {

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: ''
  })
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

  const validateForm = () => {
    if (!form.name.trim()) {
      return '이름을 입력하세요'
    }
    if (!form.email.trim()) {
      return '이메일을 입력하세요'
    }
    if (!form.password.trim()) {
      return '비밀번호를 입력하세요'
    }
    if (form.password.length < 6) {
      return '비밀번호를 6자 이상 입력하세요'
    }
    if (!form.passwordConfirm.trim()) {
      return '비밀번호를 확인을 입력하세요'
    }
    if (form.password !== form.passwordConfirm) {
      return '비밀번호를 비밀번호 확인이 일치하지 않습니다.'
    }
    if (!form.phone.trim()) {
      return '전화번호를 입력하세요'
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationMessage = validateForm()

    if (validationMessage) {
      setError(validationMessage)

      return
    }

    setError('')
    setIsLoading(true)
    try {
      await signup(form)
      alert('회원가입이 완료되었습니다.')
      navigate('/login')
    } catch (error) {
      setError(error.message || '회원 가입중 오류가 발생했습니다.')
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
              <h2>회원가입</h2>
              <Button
                text="뒤로가기"
                backico='wh'
                className="back"
                onClick={handleBack} />
            </nav>
            <form className='auth-form' onSubmit={handleSubmit}>
              <div className="form-group">
                <Input
                  type="name"
                  name="name"
                  value={form.name}
                  placeholder="이름을 입력하세요"
                  onChange={handleChange} />
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
              {error && <p className='error-text'> {error}</p>}
              <div className="auth-btn-wrap">
                <Button
                  text={isLoading ? "가입 중..." : "회원가입"}
                  text="회원가입"
                  type="submit"
                  className="primary" />
              </div>
            </form>
            <div className="auth-now">
              <span>이미 계정이 있으신가요?</span>
              <Link to="/login">
                <Button text="로그인하기" tColor='bl' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup