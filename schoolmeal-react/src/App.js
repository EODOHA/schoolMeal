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
import FindAccount from './component/sign/FindAccount';
import EmailVerification from './component/sign/EmailVerification';
import ReEmailVerification from './component/sign/ReEmailVerification';
import UnauthorizedPage from './component/sign/UnauthorizedPage';
import Memberlist from './component/memManage/Memberlist';
import MainManager from './component/mainManage/MainManager';
import ProfileUpdate from './component/profile/ProfileUpdate';
import AdminNoticeManagerRoutes from './component/mainManage/adminNoticeManager/routes/AdminNoticeManagerRoutes';

// 급식자료실
import MealResourceRoutes from './component/mealResource/routes/MealResourceRoutes'; 

// 교육자료
import EduDataRoutes from './component/eduData/routes/EduDataRoutes';

//급식정보
import MealInfoRoutes from './component/mealInfo/routes/MealInfoRoutes';

//식재료정보
import IngredientInfoRoutes from './component/IngredientInfo/routes/IngredientInfoRoutes';

// 커뮤니티-공지사항 관련 라우팅
import NoticeList from './component/community/notice/NoticeList';
import CreateNotice from './component/community/notice/CreateNotice';
import NoticeDetail from './component/community/notice/NoticeDetail';

// 커뮤니티-가공식품 관련 컴포넌트 추가
import ProcessedFoodList from './component/community/processedFood/ProcessedFoodList';
import CreateProcessedFood from './component/community/processedFood/CreateProcessedFood';
import ProcessedFoodDetail from './component/community/processedFood/ProcessedFoodDetail';

// 커뮤니티-지역별 커뮤니티 관련 컴포넌트 추가
import RegionalCommunityList from './component/community/regionalCommunity/RegionalCommunityList';
import CreateRegionalCommunity from './component/community/regionalCommunity/CreateRegionalCommunity';
import RegionalCommunityDetail from './component/community/regionalCommunity/RegionalCommunityDetail';

// 커뮤니티-급식 뉴스와 학술 자료 컴포넌트 추가
import SchoolMealNewsList from './component/community/schoolNews/SchoolMealNewsList';
import AcademicMaterialsList from './component/community/materials/AcademicMaterialsList';
import ChatApp from './ChatApp';



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
              <Route path="findAccount" element={<FindAccount />} />
              <Route path="emailVerification" element={<EmailVerification />} />
              <Route path="ReEmailVerification" element={<ReEmailVerification />} />
              <Route path="profileUpdate" element={<ProfileUpdate />} />
              <Route path="chat" element={<ChatApp />} />

              {/* 권한으로 보호된 페이지 */}
              <Route path="memberlist" element={<AdminRoute element={<Memberlist />} />} />
              <Route path="mainManager" element={<AdminRoute element={<MainManager />} />} />
              
              {AdminNoticeManagerRoutes.props.children}

              {/* 기능별 Routes 파일 연결 */}
              {MealResourceRoutes.props.children}
              {EduDataRoutes.props.children}
              {MealInfoRoutes.props.children}
              {IngredientInfoRoutes.props.children}

               {/* 커뮤니티-공지사항 관련 라우팅 추가 */}
               <Route path="community/notices" element={<NoticeList />} />
              <Route path="community/notices/create" element={<CreateNotice />} />
              <Route path="community/notices/:id" element={<NoticeDetail />} />
              <Route path="community/notices/edit/:id" element={<CreateNotice />} />

              {/* 커뮤니티-가공식품 관련 라우팅 추가 */}
              <Route path="community/processed-foods" element={<ProcessedFoodList />} />
              <Route path="community/processed-foods/create" element={<CreateProcessedFood />} />
              <Route path="community/processed-foods/:id" element={<ProcessedFoodDetail />} />
              <Route path="community/processed-foods/edit/:id" element={<CreateProcessedFood />} />

              {/* 커뮤니티-지역별 커뮤니티 관련 라우팅 추가 */}
              <Route path="community/regions" element={<RegionalCommunityList />} />
              <Route path="community/regions/create" element={<CreateRegionalCommunity />} />
              <Route path="community/regions/:id" element={<RegionalCommunityDetail />} />
              <Route path="community/regions/edit/:id" element={<CreateRegionalCommunity />} />

              {/* 커뮤니티-급식 뉴스 및 학술 자료 관련 라우팅 추가 */}
              <Route path="community/crawling/school-news" element={<SchoolMealNewsList />} />
              <Route path="community/crawling/academic-materials" element={<AcademicMaterialsList />} />

           
             
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