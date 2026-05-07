import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getMe, logout as apiLogout } from '../api/auth.api'; // 작성하신 API import

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [member, setmember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const memberData = await getMe(); // 백엔드에 내 정보 물어보기
        setmember(memberData); 
      } catch (error) {
        setmember(null); // 에러가 나면 비로그인 상태
      } finally {
        setIsLoading(false); 
      }
    };
    checkAuthStatus();
  }, []);

  const login = (memberData) => {
    setmember(memberData);
  };

  const logout = async () => {
    try {
      await apiLogout(); // 백엔드 세션 파기 API 호출
      setmember(null);     // 프론트엔드 유저 정보 초기화
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const value = useMemo(() => ({
    member,
    isAuthed: !!member,
    login,
    logout,
    isLoading,
    isReady: !isLoading
  }), [member, isLoading]);

  return (
    <AuthCtx.Provider value={value}>
      {!isLoading && children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);