import React, { createContext, useState, useContext } from 'react';

// navLinks 초기 값 설정
const navLinksInitial = [
    {
        path: "/mealInfo", label: "급식 정보",
        subLinks: [
            { path: "/mealInfo/meal-menu", label: "학교별 급식 식단 정보" },
            { path: "/mealInfo/meal-archive", label: "학교급식 과거와 현재" },
            { path: "/mealInfo/meal-expert", label: "학교급식 전문가 인력관리" }

        ]
    },
    {
        path: "/ingredientInfo", label: "식재료 정보",
        subLinks: [
            { path: "/ingredientInfo/ingredient-price", label: "식재료 가격 정보" },
            { path: "/ingredientInfo/product-safety", label: "식품 안정성 조사결과 정보" },
            { path: "/ingredientInfo/haccp-info", label: "식재료 안정성 인증 정보" },
        ]
    },
    {
        path: "/mealResource", label: "급식 자료실",
        subLinks: [
            { path: "/mealResource/meal-policy-operation", label: "급식 정책 및 운영" },
            { path: "/mealResource/menu-recipe", label: "식단 및 레시피" },
            { path: "/mealResource/nutrition-manage", label: "영양 관리" },
            { path: "/mealResource/meal-hygiene", label: "급식 위생" },
            { path: "/mealResource/meal-facility-equipment", label: "급식 시설 및 설비" },
            { path: "/mealResource/school-meal-case", label: "학교급식 우수사례" }
        ],
        showSearch: true
    },
    {
        path: "/eduData", label: "교육자료",
        subLinks: [
            { path: "/eduData/nutrition-diet-education", label: "영양 및 식생활 교육자료" },
            { path: "/eduData/video-education", label: "영상 교육자료" },
            { path: "/eduData/lesson-demo-video", label: "수업/시연 영상" },
            { path: "/eduData/edu-material-sharing", label: "교육자료 나눔" }
        ]
    },
    { path: "/mealcounsel", label: "영양상담",
        subLinks: [
            { path: "/mealcounsel/list", label: "영양상담 목록" },
            { path: "/counsel", label: "영양상담 진단 페이지" },
            { path: "/mealcounsel/CounselHistoryList", label: "영양상담 작성"}
        
        ],
        showSearch: true  // 검색창을 보여줄 항목
    },

    {
        path: "/community", label: "커뮤니티",
        subLinks: [
            { path: "/community/notices", label: "공지사항" },
            { path: "/community/processed-foods", label: "가공식품정보" },
            { path: "/community/regions", label: "지역별 커뮤니티" },
            { path: "/community/crawling/school-news", label: "급식 뉴스" },
            { path: "/community/crawling/materials", label: "학술 정보" }
        ],
        showSearch: true
    },
    {
        path: "/test7", label: "테스트7",
        subLinks: [
            { path: "/test7/sub1", label: "테스트7-서브1" },
            { path: "/test7/sub2", label: "테스트7-서브2" }
        ],
        showSearch: true  // 검색창을 보여줄 항목
    },

];

// NavLinksContext를 createContext로 생성합니다.
const NavLinksContext = createContext();

// NavLinksProvider 컴포넌트로 값을 제공
export const NavLinksProvider = ({ children }) => {
    const [navLinks, setNavLinks] = useState(navLinksInitial);
    const [selectedParent, setSelectedParent] = useState(null); // 부모 선택 상태 추가

    return (
        <NavLinksContext.Provider value={{ navLinks, setNavLinks, selectedParent, setSelectedParent }}>
            {children}
        </NavLinksContext.Provider>
    );
};

// NavLinksContext를 사용하는 hook을 export
export const useNavLinks = () => useContext(NavLinksContext);
