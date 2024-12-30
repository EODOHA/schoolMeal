import React from "react";
import { Route, Routes } from "react-router-dom";

// 영양상담 관련 임포트
import MealCounselList from "../lists/MealCounselList";
import MealCounselDetail from "../details/MealCounselDetail";
import MealCounselEdit from "../edits/MealCounselEdit";
import MealCounselWrite from "../writes/MealCounselWrite";

import BoardAdminRoute from "../../sign/BoardAdminRoute";

import MealCounselHistoryList from "../lists/MealCounselHistoryList";
import MealCounselHistoryDetail from "../details/MealCounselHistoryDetail";
import MealCounselHistoryEdit from "../edits/MealCounselHistoryEdit";
import MealCounselHistoryWrite from "../writes/MealCounselHistoryWrite";

const MealCounselRoutes = (
  <Routes>
    <Route path="mealCounsel/*">
      <Route path="meal-counsel" element={<MealCounselList />} />
      <Route path="meal-counsel/:id" element={<MealCounselDetail />} />
      <Route path="meal-counsel/update/:id" element={<MealCounselEdit />} />
      <Route path="meal-counsel/write" element={<MealCounselWrite />} />

      {/* 관리자, 게시판 담당자용 페이지 */}
      <Route path="meal-counsel-history" element={<BoardAdminRoute element={<MealCounselHistoryList />} /> } />
      <Route path="meal-counsel-history/:id" element={<BoardAdminRoute element={<MealCounselHistoryDetail />} />} />
      <Route path="meal-counsel-history/update/:id" element={<BoardAdminRoute element={<MealCounselHistoryEdit />} />} />
      <Route path="meal-counsel-history/write" element={<BoardAdminRoute element={<MealCounselHistoryWrite />} />} />
    </Route>  
  </Routes>
);

export default MealCounselRoutes;
