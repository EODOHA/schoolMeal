import React from 'react';
import { Route } from "react-router-dom";

// 급식자료실 관련 컴포넌트 임포트
import MealResourceMain from './MealResourceMain';
import MealPolicyOperationList from "../lists/MealPolicyOperationList";
import MenuRecipeList from "../lists/MenuRecipeList";
import MealPolicyOperationDetail from "../details/MealPolicyOperationDetail";
import MenuRecipeDetail from "../details/MenuRecipeDetail";
import MealPolicyOperationEdit from "../edits/MealPolicyOperationEdit";
import MenuRecipeEdit from "../edits/MenuRecipeEdit";
import MealPolicyOperationWrite from "../writes/MealPolicyOperationWrite";
import MenuRecipeWrite from "../writes/MenuRecipeWrite";

const MealResourceRoutes = (
  <>
    <Route path="mealResource/*">
      <Route index element={<MealResourceMain />} /> {/* 기본 경로 */}
      <Route path="meal-policy-operation" element={<MealPolicyOperationList />} />
      <Route path="menu-recipe" element={<MenuRecipeList />} />
      <Route path="meal-policy-operation/:id" element={<MealPolicyOperationDetail />} />
      <Route path="menu-recipe/:id" element={<MenuRecipeDetail />} />
      <Route path="meal-policy-operation/update/:id" element={<MealPolicyOperationEdit />} />
      <Route path="menu-recipe/update/:id" element={<MenuRecipeEdit />} />
      <Route path="meal-policy-operation/write" element={<MealPolicyOperationWrite />} />
      <Route path="menu-recipe/write" element={<MenuRecipeWrite />} />
    </Route>  
  </>
);

export default MealResourceRoutes;
