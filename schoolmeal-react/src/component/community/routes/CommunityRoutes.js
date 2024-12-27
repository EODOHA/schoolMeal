import React from "react";
import { Route, Routes } from "react-router-dom";

// 공지사항 관련 임포트
import NoticeList from "../lists/NoticeList";
import NoticeDetail from "../details/NoticeDetail";
import NoticeEdit from "../edits/NoticeEdit";
import NoticeWrite from "../writes/NoticeWrite";

// 가공식품정보 관련 임포트
import ProcessedFoodList from "../lists/ProcessedFoodList";
import ProcessedFoodWrite from "../writes/ProcessedFoodWrite";
import ProcessedFoodEdit from "../edits/ProcessedFoodEdit";
import ProcessedFoodUpload from "../uploads/ProcessedFoodUpload";

// 게시판 담당자 이상 권한 설정 관련 임포트
import BoardAdminRoute from '../../sign/BoardAdminRoute';


const CommunityRoutes = (
  <Routes>
    <Route path="community/*">
      <Route path="notices" element={<NoticeList />} />
      <Route path="notices/:id" element={<NoticeDetail />} />
      <Route path="notices/:id" element={<NoticeEdit />} />
      <Route path="notices/write" element={<NoticeWrite />} />

      <Route path="processedFood" element={<ProcessedFoodList />} />
      <Route path="processedFood/write" element={<BoardAdminRoute element={<ProcessedFoodWrite />} />} />
      <Route path="processedFood/edit/:processedFoodId" element={<BoardAdminRoute element={<ProcessedFoodEdit />} />} />
      <Route path="processedFood/write-file-upload" element={<BoardAdminRoute element={<ProcessedFoodUpload />} />} />
    </Route>
  </Routes>
);

export default CommunityRoutes;
