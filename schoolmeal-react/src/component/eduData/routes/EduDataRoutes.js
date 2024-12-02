import React from 'react';
import { Route } from "react-router-dom";

// 교육자료 관련 컴포넌트 임포트
import EduDataMain from "../routes/EduDataMain";
import NutritionDietEducationList from "../lists/NutritionDietEducationList";
import VideoEducationList from "../lists/VideoEducationList";
import NutritionDietEducationDetail from "../details/NutritionDietEducationDetail";
import VideoEducationDetail from "../details/VideoEducationDetail";
import NutritionDietEducationEdit from "../edits/NutritionDietEducationEdit";
import VideoEducationEdit from "../edits/VideoEducationEdit";
import NutritionDietEducationWrite from "../writes/NutritionDietEducationWrite";
import VideoEducationWrite from "../writes/VideoEducationWrite";

const EduDataRoutes = (
  <>
    <Route path="eduData" element={<EduDataMain />} />
    <Route path="eduData/nutrition-diet-education" element={<NutritionDietEducationList />} />
    <Route path="eduData/video-education" element={<VideoEducationList />} />
    <Route path="eduData/nutrition-diet-education/:id" element={<NutritionDietEducationDetail />} />
    <Route path="eduData/video-education/:id" element={<VideoEducationDetail />} />
    <Route path="eduData/nutrition-diet-education/update/:id" element={<NutritionDietEducationEdit />} />
    <Route path="eduData/video-education/update/:id" element={<VideoEducationEdit />} />
    <Route path="eduData/nutrition-diet-education/write" element={<NutritionDietEducationWrite />} />
    <Route path="eduData/video-education/write" element={<VideoEducationWrite />} />
  </>
);

export default EduDataRoutes;
