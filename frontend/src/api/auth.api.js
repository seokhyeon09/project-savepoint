const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const signup = async (signupData) => {
    const response = await fetch(`${BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signupData)
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.message || '회원가입 실패')
    return data
}

export const login = async (loginData) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.message || '로그인 실패')
    return data
}

export const getMe = async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.message || '회원 정보 가져오기 실패')
    return data
}

export const updateMe = async (payload) => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.message || '회원 정보 수정하기 실패')
    return data
}

export const logout = async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.message || '로그아웃 실패')
    return data
}

// ── 카카오 로그인 ──────────────────────────────────────────

/**
 * 백엔드에서 카카오 인증 URL을 받아와서 해당 URL로 이동
 */
export const redirectToKakaoLogin = async () => {
    const response = await fetch(`${BASE_URL}/auth/kakao/login-url`, {
        credentials: 'include'
    })
    const url = await response.text()
    window.location.href = url
}

/**
 * 카카오 인가 코드를 백엔드로 전달하여 로그인 처리
 */
export const kakaoCallback = async (code) => {
    const response = await fetch(`${BASE_URL}/auth/kakao/callback?code=${code}`, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.message || '카카오 로그인 실패')
    return data
}