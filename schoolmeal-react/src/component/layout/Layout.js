import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"; // useLocation을 import
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar"; // 새로 추가한 Sidebar 컴포넌트
import { useAuth } from '../sign/AuthContext';
import "../../css/layout/Layout.css"; // 스타일을 적용할 CSS 파일 import

const Layout = ({ hideHeaderFooter }) => {
  const location = useLocation(); // 현재 경로 정보 가져오기

  const { isAdmin } = useAuth();

  // 아래 URL 이름일 시, Sidebar를 숨깁니다.
  const isNoSidebarPage =
    location.pathname === "/" ||
    location.pathname === "/*" ||
    location.pathname === "/main" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/emailVerification" ||
    location.pathname === "/ReEmailVerification" ||
    location.pathname === "/findAccount" ||
    (!isAdmin && location.pathname.startsWith("/adminNoticeManager"));

  // 유저 관리 메뉴 표시 여부를 관리하는 상태 추가.
  const [isMemberManageOpen, setIsMemberManageOpen] = useState(false);

  // 마이페이지 메뉴 표시 여부를 관리하는 상태 추가.
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);
  
  // 메인 페이지 링크용 상태 추가: isSchoolMealCaseOpen
  const [isSchoolMealCaseOpen, setIsSchoolMealCaseOpen] = useState(false);

  // resize 메시지 표시 여부.
  const [showResizeMessage, setShowResizeMessage] = useState(false);

  // 최소 너비, 높이 설정.
  const minWidth = 550;

  // 화면 크기 체크 함수
  const checkSize = () => {
    if (window.innerWidth < minWidth) {
      setShowResizeMessage(true);
    } else {
      setShowResizeMessage(false);
    }
  };

  // 컴포넌트가 마운트될 때와 창 크기 변경 시 체크.
  useEffect(() => {
    checkSize(); // 초기 체크.
    window.addEventListener("resize", checkSize); // 사이즈 변경 이벤트 리스너 추가

    // 컴포넌트 언마운트 시, 이벤트 리스너 제거.
    return() => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/adminNoticeManager")) {
        setTimeout(() => {
            setIsMemberManageOpen(true); // 관리자 메뉴 열기
        }, 0); // 즉시 실행
    } else {
        setTimeout(() => {
            setIsMemberManageOpen(false); // 닫기
        }, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/adminNoticeManager")) {
      setIsMemberManageOpen(true);
      setIsProfileUpdateOpen(false);
    }
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번 실행

  useEffect(() => {
    if (location.pathname.startsWith("/profileUpdate")) {
        setTimeout(() => {
          setIsProfileUpdateOpen(true); // 관리자 메뉴 열기
        }, 0); // 즉시 실행
    } else {
        setTimeout(() => {
          setIsProfileUpdateOpen(false); // 닫기
        }, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/profileUpdate")) {
      setIsProfileUpdateOpen(true);
      setIsMemberManageOpen(false);
    }
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번 실행

  return (
    <div className={`layout-container ${isNoSidebarPage ? "" : "layout-with-sidebar"}`}>
      
      <div className="layout-main-content">
        {/* 메인, 로그인, 회원가입 페이지가 아닌 경우에만 Sidebar 표시 */}
        {!isNoSidebarPage && (
          <Sidebar
          isMemberManageOpen={location.pathname.startsWith("/adminNoticeManager") || 
                              location.pathname.startsWith("/memberlist") || 
                              location.pathname.startsWith("/mainManager")}
          isProfileUpdateOpen={location.pathname.startsWith("/profileUpdate") ||
                               location.pathname.startsWith("/chat")}
          isSchoolMealCaseOpen={isSchoolMealCaseOpen}
        />
        )}

        {/* 메인 컨텐츠 영역 */}
        <div className="layout-main">
          {/* Header, Footer는 항상 표시 */}
          {!hideHeaderFooter && (
            <Header
              setIsMemberManageOpen={setIsMemberManageOpen}
              setIsProfileUpdateOpen={setIsProfileUpdateOpen}
              setIsSchoolMealCaseOpen={setIsSchoolMealCaseOpen}
              />
            )}
          <main className="layout-content">
            <Outlet />
          </main>
          {!hideHeaderFooter && <Footer />}
        </div>
      </div>
      {showResizeMessage && (
        <>
        <div className="resize-overlay" />
        <div className="resize-message">
          화면을 올바르게 표시하기엔 
          <br />
          페이지의 폭이 적절하지 않습니다!
          <br />
          <br />
          화면의 폭을 늘려주세요!
        </div>
        </>
      )}
    </div>
  );
};

export default Layout;
