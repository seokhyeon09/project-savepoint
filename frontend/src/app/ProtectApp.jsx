import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Sidebar from '../components/layouts/Sidebar';
import './ProtectApp.scss';

const ProtectApp = () => {
  // 모바일 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      {/* 햄버거클릭 */}
      <Header onMenuClick={toggleSidebar} />
      
      {/* 사이드바 + 메인 */}
      <div className="dashboard-body">
        
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
        )}

        {/* 사이드바 (상태와 닫기 전달) */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectApp;