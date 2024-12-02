// context/NavLinksContext.js
import React, { createContext, useState, useContext } from 'react';

// navLinks 초기 값 설정
const navLinksInitial = [
    { path: "/test1", label: "테스트1",
        subLinks: [
            { path: "/test1/sub1", label: "테스트1-서브1" }, 
            { path: "/test1/sub2", label: "테스트1-서브2" }
        ] 
    },
    { path: "/test2", label: "테스트2",
        subLinks: [
            { path: "/test2/sub1", label: "테스트2-서브1" },
            { path: "/test2/sub2", label: "테스트2-서브2" }
        ]
    },
    { path: "/test3", label: "테스트3",
        subLinks: [
            { path: "/test3/sub1", label: "테스트3-서브1" },
            { path: "/test3/sub2", label: "테스트3-서브2" }
        ]
    },
    { path: "/test4", label: "테스트4",
        subLinks: [
            { path: "/test4/sub1", label: "테스트4-서브1" },
            { path: "/test4/sub2", label: "테스트4-서브2" }
        ]
    },               
    { path: "/test5", label: "테스트5",
        subLinks: [
            { path: "/test5/sub1", label: "테스트5-서브1" },
            { path: "/test5/sub2", label: "테스트5-서브2" }
        ],
        showSearch: true  // 검색창을 보여줄 항목
    },
    { path: "/test6", label: "테스트6",
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
