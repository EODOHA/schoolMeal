import React from "react";
import { Route, Routes } from "react-router-dom";

// 급식자료실 관련 컴포넌트 임포트
import MealPolicyOperationList from "../lists/MealPolicyOperationList";
import MealPolicyOperationDetail from "../details/MealPolicyOperationDetail";
import MealPolicyOperationEdit from "../edits/MealPolicyOperationEdit";
import MealPolicyOperationWrite from "../writes/MealPolicyOperationWrite";
import MenuRecipeList from "../lists/MenuRecipeList";
import MenuRecipeDetail from "../details/MenuRecipeDetail";
import MenuRecipeEdit from "../edits/MenuRecipeEdit";
import MenuRecipeWrite from "../writes/MenuRecipeWrite";
import NutritionManageList from "../lists/NutritionManageList";
import NutritionManageDetail from "../details/NutritionManageDetail";
import NutritionManageEdit from "../edits/NutritionManageEdit";
import NutritionManageWrite from "../writes/NutritionManageWrite";
import MealHygieneList from "../lists/MealHygieneList";
import MealHygieneDetail from "../details/MealHygieneDetail";
import MealHygieneEdit from "../edits/MealHygieneEdit";
import MealHygieneWrite from "../writes/MealHygieneWrite";
import MealFacilityEquipmentList from "../lists/MealFacilityEquipmentList";
import MealFacilityEquipmentDetail from "../details/MealFacilityEquipmentDetail";
import MealFacilityEquipmentEdit from "../edits/MealFacilityEquipmentEdit";
import MealFacilityEquipmentWrite from "../writes/MealFacilityEquipmentWrite";
import SchoolMealCaseList from "../lists/SchoolMealCaseList";
import SchoolMealCaseDetail from "../details/SchoolMealCaseDetail";
import SchoolMealCaseEdit from "../edits/SchoolMealCaseEdit";
import SchoolMealCaseWrite from "../writes/SchoolMealCaseWrite";

const MealResourceRoutes = (
  <Routes>
    <Route path="mealResource/*">
      <Route path="meal-policy-operation" element={<MealPolicyOperationList />} /> 
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
      <Route path="meal-hygiene" element={<MealHygieneList />} />
      <Route path="meal-hygiene/:id" element={<MealHygieneDetail />} />
      <Route path="meal-hygiene/update/:id" element={<MealHygieneEdit />} />
      <Route path="meal-hygiene/write" element={<MealHygieneWrite />} />
      <Route path="meal-facility-equipment" element={<MealFacilityEquipmentList />} />
      <Route path="meal-facility-equipment/:id" element={<MealFacilityEquipmentDetail />} />
      <Route path="meal-facility-equipment/update/:id" element={<MealFacilityEquipmentEdit />} />
      <Route path="meal-facility-equipment/write" element={<MealFacilityEquipmentWrite />} />
      <Route path="school-meal-case" element={<SchoolMealCaseList />} />
      <Route path="school-meal-case/:id" element={<SchoolMealCaseDetail />} />
      <Route path="school-meal-case/update/:id" element={<SchoolMealCaseEdit />} />
      <Route path="school-meal-case/write" element={<SchoolMealCaseWrite />} />
    </Route>  
  </Routes>
);

export default MealResourceRoutes;
