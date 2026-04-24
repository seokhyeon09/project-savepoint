// src/app/ProtectApp.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layouts/Header'
import Sidebar from '../components/layouts/Sidebar'// 우리가 논의한 <aside> 내비게이션
import './ProtectApp.scss'


const ProtectApp = () => {
  return (
    <div className="dashboard-layout">
      {/* 1. 상단 바 (고정) */}
      <Header />
      
      {/* 2. 하단 영역 (좌측 사이드바 + 우측 메인 콘텐츠) */}
      <div className="dashboard-body">
        <Sidebar />
        
        {/* 자식 라우트(Dashboard 등)가 렌더링되는 실제 영역 */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectApp;