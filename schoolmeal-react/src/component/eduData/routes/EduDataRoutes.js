import React from 'react';
import { Route } from "react-router-dom";

// 교육자료 관련 컴포넌트 임포트
import NutritionDietEducationList from "../lists/NutritionDietEducationList";
import NutritionDietEducationDetail from "../details/NutritionDietEducationDetail";
import NutritionDietEducationEdit from "../edits/NutritionDietEducationEdit";
import NutritionDietEducationWrite from "../writes/NutritionDietEducationWrite";
import VideoEducationList from "../lists/VideoEducationList";
import VideoEducationDetail from "../details/VideoEducationDetail";
import VideoEducationEdit from "../edits/VideoEducationEdit";
import VideoEducationWrite from "../writes/VideoEducationWrite";
import LessonDemoVideoList from "../lists/LessonDemoVideoList";
import LessonDemoVideoDetail from "../details/LessonDemoVideoDetail";
import LessonDemoVideoEdit from "../edits/LessonDemoVideoEdit";
import LessonDemoVideoWrite from "../writes/LessonDemoVideoWrite";
import EduMaterialSharingList from "../lists/EduMaterialSharingList";
import EduMaterialSharingDetail from "../details/EduMaterialSharingDetail";
import EduMaterialSharingEdit from "../edits/EduMaterialSharingEdit";
import EduMaterialSharingWrite from "../writes/EduMaterialSharingWrite";


const EduDataRoutes = (
  <>
    <Route path="eduData/*">
      <Route path="nutrition-diet-education" element={<NutritionDietEducationList />} />
      <Route path="nutrition-diet-education/:id" element={<NutritionDietEducationDetail />} />
      <Route path="nutrition-diet-education/update/:id" element={<NutritionDietEducationEdit />} />
      <Route path="nutrition-diet-education/write" element={<NutritionDietEducationWrite />} />
      <Route path="video-education" element={<VideoEducationList />} />
      <Route path="video-education/:id" element={<VideoEducationDetail />} />
      <Route path="video-education/update/:id" element={<VideoEducationEdit />} />
      <Route path="video-education/write" element={<VideoEducationWrite />} />
      <Route path="lesson-demo-video" element={<LessonDemoVideoList />} />
      <Route path="lesson-demo-video/:id" element={<LessonDemoVideoDetail />} />
      <Route path="lesson-demo-video/update/:id" element={<LessonDemoVideoEdit />} />
      <Route path="lesson-demo-video/write" element={<LessonDemoVideoWrite />} />
      <Route path="edu-material-sharing" element={<EduMaterialSharingList />} />
      <Route path="edu-material-sharing/:id" element={<EduMaterialSharingDetail />} />
      <Route path="edu-material-sharing/update/:id" element={<EduMaterialSharingEdit />} />
      <Route path="edu-material-sharing/write" element={<EduMaterialSharingWrite />} />
    </Route>
  </>
);

export default EduDataRoutes;
