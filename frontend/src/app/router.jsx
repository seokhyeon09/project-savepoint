// src/app/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import KakaoCallback from '../pages/Auth/KakaoCallback';
import Dashboard from '../pages/Dashboard/Dashboard';
import WriteGame from '../pages/Dashboard/WriteGame';
import GameDetail from '../pages/Dashboard/GameDetail';
import EditGame from '../pages/Dashboard/EditGame';
import Profile from '../pages/profile/Profile';
import ProtectRoute from '../store/ProtectRoute';
import ProtectApp from './ProtectApp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      // 카카오 OAuth 콜백 — 인증 불필요한 퍼블릭 라우트
      { path: 'kakao-callback', element: <KakaoCallback /> },
    ]
  },
  // 로그인 필요 구역
  {
    path: '/app',
    element: (
      <ProtectRoute>
        <ProtectApp />
      </ProtectRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'games/new', element: <WriteGame /> },
      { path: 'games/:id', element: <GameDetail /> },
      { path: 'games/edit/:id', element: <EditGame /> },
      { path: 'profile', element: <Profile /> },
    ]
  },
]);

export default router;