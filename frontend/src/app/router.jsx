// src/app/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import WriteGame from '../pages/Dashboard/WriteGame'; // 게임 등록 페이지 불러오기
import GameDetail from '../pages/Dashboard/GameDetail'; // 게임 상세 페이지 불러오기
import EditGame from '../pages/Dashboard/EditGame'; //게임 수정 페이지 불러오기
import Profile from '../pages/profile/Profile'; //프로필 페이지 불러오기
import ProtectRoute from '../store/ProtectRoute';
import ProtectApp from './ProtectApp';
import KakaoCallback from '../pages/Auth/KakaoCallback';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "oauth/kakao/callback", element: <KakaoCallback /> },
    ]
  },
  // 보호받는 구역
  {
    path: "/app",
    element: (
      <ProtectRoute>
        <ProtectApp />
      </ProtectRoute>
    ),
    children: [
      // /app 으로 들어오면 기본으로 대시보드를 보여줍니다.
      { index: true, element: <Dashboard /> }, 
      
      // 혹시 /app/dashboard 라고 명시적으로 들어올 때를 대비해 하나 더 추가해 두면 좋습니다.
      { path: "dashboard", element: <Dashboard /> }, 
      
      // 2. 여기에 새 게임 추가 화면을 연결합니다! (/app/games/new)
      { path: "games/new", element: <WriteGame /> },
      
      // 3. (나중에 만들 상세 페이지 주소 미리 파놓기)
      { path: "games/:id", element: <GameDetail /> },

      //수정페이지
      { path: "games/edit/:id", element: <EditGame /> },
      //프로필 페이지
      { path: 'profile', element: <Profile /> },
    ]
  },
]);

export default router;