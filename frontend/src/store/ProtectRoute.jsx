import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth.store';

const ProtectRoute = ({ children }) => {
  // isLoading을 추가로 가져옵니다.
  const { isAuthed, isLoading } = useAuth();

  // 1. 백엔드에 로그인 상태를 물어보는 중이라면 아무것도 안 하고(또는 스피너 띄우고) 기다립니다.
  if (isLoading) {
    return <div>로그인 상태 확인 중...</div>; // 예쁜 로딩 스피너로 바꾸셔도 좋습니다.
  }

  // 2. 확인이 끝났는데 로그인이 안 되어 있다면 로그인 페이지로 쫓아냅니다.
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  // 3. 로그인이 되어있다면 원래 가려던 페이지(children)를 보여줍니다.
  return children;
};

export default ProtectRoute;