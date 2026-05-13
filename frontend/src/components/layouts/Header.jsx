import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import './Header.scss'
// ✅ 수정: auth.api.js의 logout을 직접 가져오는 대신, useAuth()의 logout을 사용합니다.
//    기존: import { logout } from '../../api/auth.api';
//    이유: auth.api.js의 logout()은 서버 세션만 끊고, 스토어의 member 상태를 초기화하지 않습니다.
//          useAuth().logout()은 서버 세션 끊기 + 스토어 초기화를 모두 처리합니다.
import { useAuth } from '../../store/auth.store'

const Header = () => {
  const navigate = useNavigate();
  // ✅ 스토어에서 logout 함수 가져오기 (API 호출 + member = null 처리 통합)
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // ✅ useAuth().logout() 호출
      //    내부적으로: apiLogout() → 서버 세션 무효화 + JSESSIONID 쿠키 삭제
      //               setmember(null) → 스토어 초기화 → isAuthed = false
      await logout();
      alert('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
      alert('로그아웃 실패');
    }
  };

  return (
    <div className="header">
      <div className="header-logo"><img src="./assets/logo-wh.svg" alt="logo" /></div>
      <div className="header-loginout">
        <Button text="로그아웃" className="back" onClick={handleLogout} />
      </div>
    </div>
  )
}

export default Header