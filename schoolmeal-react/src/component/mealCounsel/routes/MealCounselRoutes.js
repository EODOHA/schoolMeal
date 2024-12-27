import React from "react";
import { Route, Routes } from "react-router-dom";

// 영양상담 관련 임포트
import MealCounselList from "../lists/MealCounselList";
import MealCounselDetail from "../details/MealCounselDetail";
import MealCounselEdit from "../edits/MealCounselEdit";
import MealCounselWrite from "../writes/MealCounselWrite";

const MealCounselRoutes = (
  <Routes>
    <Route path="mealCounsel/*">
      <Route path="meal-counsel" element={<MealCounselList />} />
      <Route path="meal-counsel/:id" element={<MealCounselDetail />} />
      <Route path="meal-counsel/update/:id" element={<MealCounselEdit />} />
      <Route path="meal-counsel/write" element={<MealCounselWrite />} />
    </Route>  
  </Routes>
);

export default MealCounselRoutes;
