import React from 'react';
import { Route } from "react-router-dom";

// 급식정보 관련 컴포넌트 임포트
import MealMenuMain from './MealMenuMain';
import MealArchiveList from '../lists/MealArchiveList';
import MealExpertList from '../lists/MealExpertList';
import MealArchiveDetail from '../details/MealArchiveDetail';
import MealExpertDetail from '../details/MealExpertDetail';


const MealInfoRoutes = (
  <>
    <Route path="mealInfo/*">
      <Route path="meal-menu" element={<MealMenuMain />} />
      <Route path="meal-archive" element={<MealArchiveList />} />
      <Route path="meal-expert" element={<MealExpertList />} />
      <Route path="meal-expert/:exp_id" element={<MealExpertDetail />} />
      <Route path="meal-archive/:id" element={<MealArchiveDetail />} />
    </Route>
  </>
);

export default MealInfoRoutes;