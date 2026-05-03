import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import './Header.scss'
import { logout } from '../../api/auth.api';

const Header = () => {
  const navigate = useNavigate();
// 로그아웃 처리 로직
    const handleLogout = async() => {
       try {
            //api.js의 함수를 실행합니다.
            await logout(); 
            
            alert('로그아웃 되었습니다.');
            
            // 성공 시 로그인 페이지로 이동
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
        <Button text="로그아웃" className="back" onClick={handleLogout}/>
      </div>
    </div>
  )
}

export default Header