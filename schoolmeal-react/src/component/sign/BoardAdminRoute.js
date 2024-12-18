import React from 'react';
import { Navigate } from 'react-router-dom'; // Navigate를 사용해 리디렉션 처리
import { useAuth } from './AuthContext';  // AuthContext에서 사용자 정보를 가져옴

// 어드민과 보드어드민만 접근가능하도록 권한 체크(게시판 권한 라우트로 사용)

const BoardAdminRoute = ({ element }) => {
    // 사용자의 로그인 상태와 게시판담당자 여부를 가져옴
    const { isAuth, isAdmin, isBoardAdmin, authCheck } = useAuth();

    // 로딩 중이면 빈 페이지 표시하거나 스피너를 렌더링
    if (authCheck) {
        return;
    }

    //  1)로그인되지 않았거나,  2)어드민도 아니고 보드어드민도 아니면 Unauthorized 페이지로 리디렉션
    if (!isAuth || (!isAdmin && !isBoardAdmin)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 어드민 또는 보드어드민일 경우에는 요청한 페이지를 렌더링
    return element;
};

export default BoardAdminRoute;