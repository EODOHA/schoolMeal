import React from 'react';
import { Navigate } from 'react-router-dom'; // Navigate를 사용해 리디렉션 처리
import { useAuth } from './AuthContext';  // AuthContext에서 사용자 정보를 가져옴

const AdminRoute = ({ element }) => {
    // 사용자의 로그인 상태와 관리자 여부를 가져옴
    const { isAuth, isAdmin, authCheck } = useAuth();

    // 로딩 중이면 빈 페이지 표시하거나 스피너를 렌더링
    if (authCheck) {
        return;
    }

    // // 로그인되지 않았거나 관리자가 아니면 Unauthorized 페이지로 리디렉션
    if (!isAuth || !isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 관리자인 경우에는 요청한 페이지를 렌더링
    return element;
};

export default AdminRoute;