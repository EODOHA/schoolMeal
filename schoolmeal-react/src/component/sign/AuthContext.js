import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBoardAdmin, setIsBoardAdmin] = useState(false);   // boardAdmin 권한 체크 추가
    const [memberId, setMemberId] = useState('');
    // 토큰 상태 추가
    const [token, setToken] = useState('');
    // 로딩 상태 추가
    const [authCheck, setAuthCheck] = useState(true);
    //JWT에서 가져올 role 추가
    const [role, setRole] = useState('');

    useEffect(() => {
        setAuthCheck(true); // 로딩 시작.
        const jwtToken = sessionStorage.getItem('jwt');   //세션에 저장된 JWT 토큰 가져오기
        if (jwtToken) {
            const decoded = jwtDecode(jwtToken);
            // console.log(decoded); // 토큰 정보 확인용.
            //디코딩된 토큰에서 정보 추출
            const member = decoded.sub;  // memberId
            const role = decoded.role;  //  role
            setMemberId(member);
            setToken(jwtToken);  // 토큰 상태 설정
            setIsAuth(true);
            //role에 따른 권한 설정
            setIsAdmin(role === 'ADMIN');
            setIsBoardAdmin(role === 'BOARDADMIN');
            setRole(role);
            
        }
        setAuthCheck(false); // 로딩 완료 설정
    }, []);

    const login = (jwtToken) => {
        setAuthCheck(true); // 로딩 시작
        sessionStorage.setItem('jwt', jwtToken);
        const decoded = jwtDecode(jwtToken);
        const member = decoded.sub;  // memberId
        const role = decoded.role;   // role
        setMemberId(member);
        setToken(jwtToken);  // 토큰 상태 설정
        setIsAuth(true);
        setRole(role);
        setIsAdmin(role === 'ADMIN');
        setIsBoardAdmin(role === 'BOARDADMIN');
        setAuthCheck(false); // 로그인 시 로딩 해제
    };

    const logout = () => {
        setAuthCheck(true); // 로딩 시작
        sessionStorage.removeItem('jwt');
        setIsAuth(false);
        setIsAdmin(false);
        setIsBoardAdmin(false);
        setMemberId('');
        setToken('');  // 토큰 상태 초기화
        setAuthCheck(false); // 로그아웃 시 로딩 해제
    };

    return (
        <AuthContext.Provider value={{ isAuth, isAdmin, isBoardAdmin, role, memberId, token, authCheck, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
