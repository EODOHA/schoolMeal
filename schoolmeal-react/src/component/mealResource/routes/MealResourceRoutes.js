import React from 'react';
import { Route } from "react-router-dom";

// 급식자료실 관련 컴포넌트 임포트
import MealPolicyOperationList from "../lists/MealPolicyOperationList";
import MealPolicyOperationDetail from "../details/MealPolicyOperationDetail";
import MealPolicyOperationEdit from "../edits/MealPolicyOperationEdit";
import MealPolicyOperationWrite from "../writes/MealPolicyOperationWrite";
import MenuRecipeList from "../lists/MenuRecipeList";
import MenuRecipeDetail from "../details/MenuRecipeDetail";
import MenuRecipeEdit from "../edits/MenuRecipeEdit";
import MenuRecipeWrite from "../writes/MenuRecipeWrite";
import NutritionManageList from '../lists/NutritionManageList';
import NutritionManageDetail from '../details/NutritionManageDetail';
import NutritionManageEdit from '../edits/NutritionManageEdit';
import NutritionManageWrite from '../writes/NutritionManageWrite';

const MealResourceRoutes = (
  <>
    <Route path="mealResource/*">
      <Route path="meal-policy-operation" element={<MealPolicyOperationList />} /> {/* 기본 경로 */}
      <Route path="meal-policy-operation/:id" element={<MealPolicyOperationDetail />} />
      <Route path="meal-policy-operation/update/:id" element={<MealPolicyOperationEdit />} />
      <Route path="meal-policy-operation/write" element={<MealPolicyOperationWrite />} />
      <Route path="menu-recipe" element={<MenuRecipeList />} />
      <Route path="menu-recipe/:id" element={<MenuRecipeDetail />} />
      <Route path="menu-recipe/update/:id" element={<MenuRecipeEdit />} />
      <Route path="menu-recipe/write" element={<MenuRecipeWrite />} />
      <Route path="nutrition-manage" element={<NutritionManageList />} />
      <Route path="nutrition-manage/:id" element={<NutritionManageDetail />} />
      <Route path="nutrition-manage/update/:id" element={<NutritionManageEdit />} />
      <Route path="nutrition-manage/write" element={<NutritionManageWrite />} />
    </Route>  
  </>
);

export default MealResourceRoutes;
