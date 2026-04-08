// src/app/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import ProtectRoute from '../store/ProtectRoute'; // 수문장 불러오기
import ProtectApp from './ProtectApp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ]
  },
  // 🔒 보호받는 구역
  {
    path: "/app",
    element: (
      <ProtectRoute>
        <ProtectApp />
      </ProtectRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
    ]
  },
]);

export default router;