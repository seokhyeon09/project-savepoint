import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import './Header.scss';
import { logout } from '../../api/auth.api';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
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
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="header-logo"><img src="/assets/logo-wh.svg" alt="logo" /></div>
      </div>

      <div className="header-loginout">
        <Button text="로그아웃" className="back" onClick={handleLogout}/>
      </div>
    </div>
  );
}

export default Header;