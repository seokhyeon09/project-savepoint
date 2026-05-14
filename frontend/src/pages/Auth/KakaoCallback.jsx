import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMe } from '@/api/auth.api'
import { useAuth } from '@/store/auth.store'
import Button from '../../components/ui/Button'
import './auth.scss'

const KakaoCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { login } = useAuth()
    const [error, setError] = useState('')

    useEffect(() => {
        const token = searchParams.get('token')

        if (token !== "session") {
            setError('정상적인 로그인 접근이 아닙니다.')
            return
        }

        const fetchUserData = async () => {
            try {
                const memberData = await getMe() 
                login(memberData) 
                navigate('/app', { replace: true })
            } catch (err) {
                setError(err.message || '유저 정보를 불러오는데 실패했습니다.')
            }
        }

        fetchUserData()
    }, [searchParams, navigate, login])

    if (error) {
        return (
            <section className="kakao-callback-section">
                <p className="error-msg">{error}</p>
                <Button 
                    text="로그인 페이지로 돌아가기" 
                    onClick={() => navigate('/login')} 
                    className="primary" 
                />
            </section>
        )
    }

    return (
        <section className="kakao-callback-section">
            <p className="loading-msg">카카오 로그인 처리 중...</p>
        </section>
    )
}

export default KakaoCallback