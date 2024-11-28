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

// 급식자료실
import MealResourceMain from './component/mealResource/main/MealResourceMain';
import MealPolicyOperationList from "./component/mealResource/lists/MealPolicyOperationList";
import MenuRecipeList from "./component/mealResource/lists/MenuRecipeList";
import MealPolicyOperationDetail from "./component/mealResource/details/MealPolicyOperationDetail";
import MenuRecipeDetail from "./component/mealResource/details/MenuRecipeDetail";
import MealPolicyOperationEdit from "./component/mealResource/edits/MealPolicyOperationEdit"; 
import MenuRecipeEdit from "./component/mealResource/edits/MenuRecipeEdit";
import MealPolicyOperationWrite from "./component/mealResource/writes/MealPolicyOperationWrite";
import MenuRecipeWrite from "./component/mealResource/writes/MenuRecipeWrite";

// 교육자료
import EduDataMain from "./component/eduData/main/EduDataMain";
import NutritionDietEducationList from "./component/eduData/lists/NutritionDietEducationList";
import VideoEducationList from "./component/eduData/lists/VideoEducationList";
import NutritionDietEducationDetail from "./component/eduData/details/NutritionDietEducationDetail";
import VideoEducationDetail from "./component/eduData/details/VideoEducationDetail";
import NutritionDietEducationEdit from "./component/eduData/edits/NutritionDietEducationEdit";
import VideoEducationEdit from "./component/eduData/edits/VideoEducationEdit";
import NutritionDietEducationWrite from "./component/eduData/writes/NutritionDietEducationWrite";
import VideoEducationWrite from "./component/eduData/writes/VideoEducationWrite";

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

              {/* 급식자료실 메인 */}
              <Route path="mealResource" element={<MealResourceMain />} />
              {/* 급식자료실 하위 게시판 */}
              <Route path="mealResource/meal-policy-operation" element={<MealPolicyOperationList />} />
              <Route path="mealResource/menu-recipe" element={<MenuRecipeList />} />
              {/* 급식자료실 상세 페이지 */}
              <Route path="mealResource/meal-policy-operation/:id" element={<MealPolicyOperationDetail />} />
              <Route path="mealResource/menu-recipe/:id" element={<MenuRecipeDetail />} />
              {/* 급식자료실 수정 페이지 */}
              <Route path="mealResource/meal-policy-operation/update/:id" element={<MealPolicyOperationEdit />} />
              <Route path="mealResource/menu-recipe/update/:id" element={<MenuRecipeEdit />} />
              {/* 급식자료실 작성 페이지 */}
              <Route path="mealResource/meal-policy-operation/write" element={<MealPolicyOperationWrite />} />
              <Route path="mealResource/menu-recipe/write" element={<MenuRecipeWrite />} />

              {/* 교육자료 메인 */}
              <Route path="eduData" element={<EduDataMain />} />
              {/* 교육자료 하위 게시판 */}
              <Route path="eduData/nutrition-diet-education" element={<NutritionDietEducationList />} />
              <Route path="eduData/video-education" element={<VideoEducationList />} />
              {/* 교육자료 상세 페이지 */}
              <Route path="eduData/nutrition-diet-education/:id" element={<NutritionDietEducationDetail />} />
              <Route path="eduData/video-education/:id" element={<VideoEducationDetail />} />
              {/* 교육자료 수정 페이지 */}
              <Route path="eduData/nutrition-diet-education/update/:id" element={<NutritionDietEducationEdit />} />
              <Route path="eduData/video-education/update/:id" element={<VideoEducationEdit />} />
              {/* 교육자료 작성 페이지 */}
              <Route path="eduData/nutrition-diet-education/write" element={<NutritionDietEducationWrite />} />
              <Route path="eduData/video-education/write" element={<VideoEducationWrite />} />
            
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
