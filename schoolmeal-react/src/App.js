// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './component/sign/AuthContext';
import { NavLinksProvider } from './component/layout/NavLinksContext';  // NavLinksProvider 임포트
import AdminRoute from './component/sign/AdminRoute';

// 페이지 컴포넌트들 임포트
import Layout from './component/layout/Layout';
import MainPage from './MainPage';
import SelectLogAndMain from './component/sign/SelectLogAndMain';
import Login from './component/sign/Login';
import Signup from './component/sign/Signup';
import UnauthorizedPage from './component/sign/UnauthorizedPage';
import Memberlist from './component/memManage/Memberlist';
import MainManager from './component/mainManage/MainManager';

function App() {
  return (
    // AuthProvider와 NavLinksProvider를 중첩하여 감싸기
    <AuthProvider> 
      <NavLinksProvider>  {/* NavLinksProvider 추가 */}
        <Router>
          <Routes>
            {/* 첫 번째 레이아웃 */}
            <Route path="/" element={<Layout hideHeaderFooter={true} />}>
              <Route index element={<SelectLogAndMain />} />
            </Route>

            {/* 두 번째 레이아웃 */}
            <Route path="/*" element={<Layout hideHeaderFooter={false} />}>
              <Route path="main" element={<MainPage />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />

              {/* 권한으로 보호된 페이지 */}
              <Route path="memberlist" element={<AdminRoute element={<Memberlist />} />} />
              <Route path="mainManager" element={<AdminRoute element={<MainManager />} />} />
            </Route>

            {/* 권한 없음 페이지 */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Routes>
        </Router>
      </NavLinksProvider>  {/* NavLinksProvider 닫기 */}
    </AuthProvider>
  );
}

export default App;
