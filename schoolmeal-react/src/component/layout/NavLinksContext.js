// context/NavLinksContext.js
import React, { createContext, useState, useContext } from 'react';

// navLinks 초기 값 설정
const navLinksInitial = [
    { path: "/test1", label: "급식 정보",
        subLinks: [
            { path: "/test1/sub1", label: "테스트1-서브1" }, 
            { path: "/test1/sub2", label: "테스트1-서브2" }
        ] 
    },
    { path: "/test2", label: "식재료 정보",
        subLinks: [
            { path: "/test2/sub1", label: "테스트2-서브1" },
            { path: "/test2/sub2", label: "테스트2-서브2" }
        ]
    },
    { path: "/mealResource", label: "급식 자료실",
        subLinks: [
            { path: "/mealResource/meal-policy-operation", label: "급식 정책 및 운영" },
            { path: "/mealResource/menu-recipe", label: "식단 및 레시피" },
            { path: "/mealResource/nutrition-manage", label: "영양 관리" },
            { path: "/mealResource/meal-hygiene", label: "급식 위생" },
            { path: "/mealResource/meal-facility-equipment", label: "급식 시설 및 설비" },
            { path: "/mealResource/school-meal-cases", label: "학교급식 우수사례" },
            { path: "/mealResource/eduOffice-mealData", label: "교육청 급식자료" }
        ],
        showSearch: true
    },
    { path: "/eduData", label: "교육자료",
        subLinks: [
            { path: "/eduData/nutrition-diet-education", label: "영양 및 식생활 교육자료" },
            { path: "/eduData/video-education", label: "영상 교육자료" },
            { path: "/eduData/lesson-demo-video", label: "수업/시연 영상" },
            { path: "/eduData/edu-material-sharing", label: "교육자료 나눔" }
        ]
    },               
    { path: "/test5", label: "영양상담",
        subLinks: [
            { path: "/test5/sub1", label: "테스트5-서브1" },
            { path: "/test5/sub2", label: "테스트5-서브2" }
        ],
        showSearch: true  // 검색창을 보여줄 항목
    },
    { path: "/test6", label: "커뮤니티",
        subLinks: [
            { path: "/test6/sub1", label: "테스트6-서브1" },
            { path: "/test6/sub2", label: "테스트6-서브2" }
        ],
        showSearch: true  // 검색창을 보여줄 항목
    },
    { path: "/test7", label: "테스트7",
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
