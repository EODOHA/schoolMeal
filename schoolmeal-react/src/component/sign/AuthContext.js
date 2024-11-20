import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [memberId, setMemberId] = useState('');
    // 토큰 상태 추가
    const [token, setToken] = useState('');
    // 로딩 상태 추가
    const [authCheck, setAuthCheck] = useState(true);

    useEffect(() => {
        setAuthCheck(true); // 로딩 시작.
        const jwtToken = sessionStorage.getItem('jwt');
        if (jwtToken) {
            const decoded = jwtDecode(jwtToken);
            // console.log(decoded);
            const member = decoded.sub;  // memberId
            setMemberId(member);
            setToken(jwtToken);  // 토큰 상태 설정
            setIsAuth(true);
            setIsAdmin(member === 'admin');
        }
        setAuthCheck(false); // 로딩 완료 설정
    }, []);

    const login = (jwtToken) => {
        setAuthCheck(true); // 로딩 시작
        sessionStorage.setItem('jwt', jwtToken);
        const decoded = jwtDecode(jwtToken);
        const member = decoded.sub;  // memberId
        setMemberId(member);
        setToken(jwtToken);  // 토큰 상태 설정
        setIsAuth(true);
        setIsAdmin(member === 'admin');
        setAuthCheck(false); // 로그인 시 로딩 해제
    };

    const logout = () => {
        setAuthCheck(true); // 로딩 시작
        sessionStorage.removeItem('jwt');
        setIsAuth(false);
        setIsAdmin(false);
        setMemberId('');
        setToken('');  // 토큰 상태 초기화
        setAuthCheck(false); // 로그아웃 시 로딩 해제
    };

    return (
        <AuthContext.Provider value={{ isAuth, isAdmin, memberId, token, authCheck, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
