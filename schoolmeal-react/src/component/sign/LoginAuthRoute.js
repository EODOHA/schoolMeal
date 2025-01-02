import React from 'react';
import { Navigate } from 'react-router-dom'; // Navigate를 사용해 리디렉션 처리
import { useAuth } from './AuthContext';  // AuthContext에서 사용자 정보를 가져옴

// 로그인한 사용자만 접근가능하도록 권한 체크( 지역별 커뮤니티 라우트로 사용)

const LoginAuthRoute = ({ element }) => {
    // 사용자의 로그인 상태를 가져옴
    const { isAuth, authCheck } = useAuth();

    // 로딩 중이면 빈 페이지 표시하거나 스피너를 렌더링
    if (authCheck) {
        return;
    }

    //  로그인되지 않았으면 Unauthorized 페이지로 리디렉션
    if (!isAuth) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 로그인한 사용자일 경우 요청한 페이지를 렌더링
    return element;
};

export default LoginAuthRoute;