import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavLinks } from './NavLinksContext'; // NavLinksContext import
import '../../css/layout/Sidebar.css';  // Sidebar.css 파일을 import

const Sidebar = ({ isMemberManageOpen, isProfileUpdateOpen }) => {
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

    return (
        <div className="sidebar">
            {/* 선택된 부모 게시판이 있을 때만 그 부모의 자식 게시판을 표시 */}
            {!isMemberManageOpen && !isProfileUpdateOpen && selectedParent && (
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

            {/* 마이페이지 관리 메뉴 추가 */}
            {isProfileUpdateOpen && (
                <div className="sub-links">
                    <h3>마이페이지</h3>
                    <ul>
                        <li>
                            <Link to="/profileUpdate">회원정보수정</Link>
                        </li>
                        <li>
                            <Link to="/test">테스트</Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
