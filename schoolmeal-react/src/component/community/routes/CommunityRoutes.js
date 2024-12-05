import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NoticeList from '../notice/NoticeList';
import CreateNotice from '../notice/CreateNotice';
import NoticeDetail from '../notice/NoticeDetail';
import ProcessedFoodList from '../processedFood/ProcessedFoodList';
import RegionalCommunityList from '../regionalCommunity/RegionalCommunityList';
import SchoolMealNewsList from '../schoolNews/SchoolMealNewsList';
import AcademicMaterialsList from '../materials/AcademicMaterialsList';

const CommunityRoutes = () => (
  <Routes>
    {/* 공지사항 목록 */}
    <Route path="/community/notice" element={<NoticeList />} />

    {/* 공지사항 작성 */}
    <Route path="notice/create" element={<CreateNotice />} />

    {/* 공지사항 상세 조회 */}
    <Route path="notice/:id" element={<NoticeDetail />} />

    {/* 기타 게시판 목록 */}
    <Route path="processedFood" element={<ProcessedFoodList />} />
    <Route path="regional" element={<RegionalCommunityList />} />
    <Route path="schoolMealNews" element={<SchoolMealNewsList />} />
    <Route path="academicMaterials" element={<AcademicMaterialsList />} />
  </Routes>
);

export default CommunityRoutes;
