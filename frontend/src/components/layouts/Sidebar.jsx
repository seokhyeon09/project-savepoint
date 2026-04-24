// src/components/layouts/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="user">
        유저
      </div>
      {/* 여기에 프로필 요약 정보 등 추가 */}
      <nav className="mt-4 flex-1">
        <ul className="library">
          <li><Link to="/app">전체 라이브러리</Link></li>
          <li><Link to="/app/playing">플레이 중</Link></li>
          <li><Link to="/app/complete">플레이 완료</Link></li>
          <li><Link to="/app/wishlist">위시 리스트</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;