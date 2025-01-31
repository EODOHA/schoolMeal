import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavLinks } from './NavLinksContext'; // NavLinksContext import
import '../../css/layout/Sidebar.css';  // Sidebar.css 파일을 import
import ChatApp from '../../ChatApp';

const Sidebar = ({ isMemberManageOpen, isProfileUpdateOpen, isStatsOpen }) => {
    const location = useLocation();
    const { navLinks, selectedParent, setSelectedParent } = useNavLinks();

    useEffect(() => {
        if (selectedParent) {
            localStorage.setItem('selectedParent', JSON.stringify(selectedParent))
        }
    }, [selectedParent]);

    useEffect(() => {
        const storedSelectedParent = localStorage.getItem('selectedParent');
        if (storedSelectedParent) {
            setSelectedParent(JSON.parse(storedSelectedParent));
        }
    }, [])

    // 부모 게시판 자동 선택 로직 추가
    useEffect(() => {
        // 현재 경로에 해당하는 부모 게시판을 탐색
        const parent = navLinks.find((link) =>
            link.subLinks.some((subLink) => location.pathname.startsWith(subLink.path))
        );
        if (parent && parent !== selectedParent) {
            setSelectedParent(parent);
        }
    }, [location.pathname, navLinks, selectedParent, setSelectedParent]);

    return (
        <div className="sidebar">
            {/* 선택된 부모 게시판이 있을 때만 그 부모의 자식 게시판을 표시 */}
            {!isMemberManageOpen && !isProfileUpdateOpen && !isStatsOpen && selectedParent && (
                <div className="sub-links">
                    <h3>{selectedParent.label}</h3>
                    <ul>
                        {/* 선택된 부모의 자식 게시판만 렌더링 */}
                        {selectedParent.subLinks.map((subLink, index) => (
                            <li key={index}>
                                <Link to={subLink.path}>{subLink.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className='sidebar-cover'>
                <h3>▶</h3>
            </div>
            {/* 유저 관리 메뉴 추가 */}
            {isMemberManageOpen && (
                <div className="sub-links">
                    <h3>관리</h3>
                    <ul>
                        <li>
                            <Link to="/memberlist">유저 관리</Link>
                        </li>
                        <li>
                            <Link to="/mainManager">메인 페이지 관리</Link>
                        </li>
                        <li>
                            <Link to="/adminNoticeManager">메인 공지사항 관리</Link>
                        </li>
                    </ul>
                </div>
            )}
            {/* 통계 분석 메뉴 추가 */}
            {isStatsOpen && (
                <div className="sub-links">
                    <h3>통계분석</h3>
                    <ul>
                        <li>
                            <Link to="/stats/members">가입자 수 통계</Link>
                        </li>
                        <li>
                            <Link to="/stats/pages">게시판별 방문 통계</Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* 마이페이지 관리 메뉴 추가 */}
            {isProfileUpdateOpen && (
                <div className="sub-links">
                    <h3>마이페이지</h3>
                    <ul>
                        <li>
                            <Link to="/profileUpdate">회원정보수정</Link>
                        </li>
                        <li>
                            <Link to="/chat">채팅</Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
