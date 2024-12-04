import React from 'react';
import { Route } from "react-router-dom";

// 급식정보 관련 컴포넌트 임포트
import MealInfoMain from "../routes/MealInfoMain";
import MealMenuMain from './MealMenuMain';
import MealArchiveList from '../lists/MealArchiveList';
import MealExpertList from '../lists/MealExpertList';
import MealArchiveDetail from '../details/MealArchiveDetail';

const MealInfoRoutes = (
  <>
    <Route path="mealInfo" element={<MealInfoMain />} />
    <Route path="mealInfo/meal-menu" element={<MealMenuMain />} />
    <Route path="mealInfo/meal-archive" element={<MealArchiveList />} />
    <Route path="mealInfo/meal-expert" element={<MealExpertList />}/>
    <Route path="mealInfo/meal-archive/:id" element={<MealArchiveDetail />} />
  </>
);

export default MealInfoRoutes;
