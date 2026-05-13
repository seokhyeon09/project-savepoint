import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { kakaoCallback } from '@/api/auth.api'
import { useAuth } from '@/store/auth.store'

const KakaoCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { login } = useAuth()
    const [error, setError] = useState('')

    useEffect(() => {
        const code = searchParams.get('code')

        if (!code) {
            setError('카카오 인증 코드가 없습니다.')
            return
        }

        const handleKakaoLogin = async () => {
            try {
                const memberData = await kakaoCallback(code)
                login(memberData)
                navigate('/app', { replace: true })
            } catch (err) {
                setError(err.message || '카카오 로그인에 실패했습니다.')
            }
        }

        handleKakaoLogin()
    }, [searchParams])

    if (error) {
        return (
            <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: '#ff6b6b' }}>{error}</p>
                <button onClick={() => navigate('/login')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    로그인 페이지로 돌아가기
                </button>
            </section>
        )
    }

    return (
        <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: '#E8D5A3' }}>카카오 로그인 처리 중...</p>
        </section>
    )
}

export default KakaoCallback