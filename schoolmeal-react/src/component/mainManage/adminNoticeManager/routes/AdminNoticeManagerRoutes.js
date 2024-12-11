import React from 'react';
import { Route } from "react-router-dom";

// 관리자 공지사항 관련 임포트
import AdminNoticeManagerList from "../lists/AdminNoticeManagerList";
import AdminNoticeManagerWrite from "../writes/AdminNoticeManagerWrite";
import AdminNoticeManagerEdit from "../edits/AdminNoticeManagerEdit";
import AdminNoticeManagerDetail from "../details/AdminNoticeManagerDetail";
import AdminRoute from '../../../sign/AdminRoute';


const AdminNoticeManagerRoutes = (
  <>
    <Route path="adminNoticeManager/*">
      <Route index element={<AdminNoticeManagerList />} /> {/* 기본 경로 */}
      <Route path="write" element={<AdminRoute element={<AdminNoticeManagerWrite />} />} />
      <Route path="edit/:id" element={<AdminRoute element={<AdminNoticeManagerEdit />} />} />
      <Route path="detail/:id" element={<AdminNoticeManagerDetail />} />
    </Route>
  </>
);

export default AdminNoticeManagerRoutes;
