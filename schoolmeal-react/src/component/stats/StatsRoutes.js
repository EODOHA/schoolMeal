import React from 'react';
import { Route } from "react-router-dom";
import MemberStatsBoard from './MemberStatsBoard';
import AdminRoute from '../sign/AdminRoute';
import PageStatsBoard from './PageStatsBoard';

const StatsRoutes = (

  <>
    <Route path="stats/*">
      <Route path="members" element={<AdminRoute element={<MemberStatsBoard />} />} />
      <Route path="pages" element={<AdminRoute element={<PageStatsBoard />} />} />
    </Route>
  </>

);

export default StatsRoutes;
