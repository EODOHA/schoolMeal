import React from 'react';
import { Route } from "react-router-dom";
import MemberStatsBoard from './MemberStatsBoard';
import BoardAdminRoute from '../sign/AdminRoute';
import PageStatsBoard from './PageStatsBoard';

const StatsRoutes = (

  <>
    <Route path="stats/*">
      <Route path="members" element={<BoardAdminRoute element={<MemberStatsBoard />} />} />
      <Route path="pages" element={<BoardAdminRoute element={<PageStatsBoard />} />} />
    </Route>
  </>

);

export default StatsRoutes;
