import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../../Constants";
import Button from "@mui/material/Button";
import { MdAttachFile } from "react-icons/md";
import { BsFileExcel } from "react-icons/bs";
import { HiChevronLeft, HiChevronDoubleLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi";
import "../../../css/page/Pagination.css";
import { useAuth } from "../../sign/AuthContext";  // 권한설정
import SearchBar from "../../common/SearchBar";  // 검색기능
import "../../../css/community/NoticeList.css";

function NoticeList() {
    const [notice, setNotice] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');  // 검색어 상태 추가
    const [selectedFilter, setSelectedFilter] = useState('전체'); // 필터 상태 추가
    const navigate = useNavigate();
    const { isAdmin, isBoardAdmin } = useAuth();  // 권한설정

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);  //현재 페이지 상태(기본값:1)
    const [postsPerPage] = useState(5); // 페이지당 게시글 수
    const [pageNumbersPerBlock] = useState(4) // 한 블록당 표시할 페이지 번호 수    

    const totalPages = Math.ceil(notice.length / postsPerPage); //전체 페이지 수
    const currentBlock = Math.ceil(currentPage / pageNumbersPerBlock); // 현재 블록 번호
    const startPage = (currentBlock - 1) * pageNumbersPerBlock + 1; //현재 블록의 첫 페이지 번호
    const endPage = Math.min(startPage + pageNumbersPerBlock - 1, totalPages);  //현재 블록의 마지막 페이지번호(전체 페이지 수를 넘지 않도록)

    // 현재 페이지의 게시물 추출
    const currentPosts = notice.filter(item => {
        // 검색어 필터링 적용
        if (selectedFilter === '제목') {
            return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (selectedFilter === '작성자') {
            return item.writer.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (selectedFilter === '내용') {
            return item.content.toLowerCase().includes(searchQuery.toLowerCase());
        } else { // 전체
            return (
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.writer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    })
        .reverse() // 게시글을 최신 순으로 정렬
        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage); // 현재 페이지에 맞는 게시글만 슬라이싱

    // 페이지 번호 클릭 시 해당 페이지로 이동
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동
    const handlePrevBlock = () => {
        if (currentPage > 1) {
            setCurrentPage(Math.max(currentPage - 1, 1));  // 1페이지보다 작은 페이지로 이동하지 않도록
        }
    }

    // 다음 페이지로 이동
    const handleNextBlock = () => {
        if (currentPage < totalPages) {
            setCurrentPage(Math.min(currentPage + 1, totalPages));  // totalPages를 넘지 않도록
        }
    };

    useEffect(() => {
        fetch(SERVER_URL + "notices")
            .then(response => response.json())
            .then(data => {
                setNotice(data._embedded.notices);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 상세 페이지로 이동하는 함수
    const goToDetailPage = (notice) => {
        const noticeId = notice.id || (notice._links?.self?.href ? extractIdFromHref(notice._links.self.href) : null);
        if (!noticeId) {
            console.error("Invalid ID:", noticeId);
            return;
        }
        navigate(`/community/notices/${noticeId}`);
    };

    const extractIdFromHref = (href) => {
        const parts = href.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className="notice-list-container">
            <h1 className="notice-title">공지사항</h1>
            <div className="notice-button-group">
                <div className="notice-left-buttons">
                    {(isAdmin || isBoardAdmin) && (
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/community/notices/write")}
                        >
                            새 글 쓰기
                        </Button>
                    )}
                </div>
                <div className="notice-right-searchbar">
                    <SearchBar
                        searchQuery={searchQuery}
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                        setSearchQuery={setSearchQuery}
                        onFilterChange={(filterType, filterValue) => {
                            setSelectedFilter(filterType);
                            setSearchQuery(filterValue);
                        }}
                    />
                </div>
            </div>
            <table className="notice-table">
                <thead className="notice-thead">
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>작성자</th>
                        <th>첨부파일</th>
                    </tr>
                </thead>
                <tbody className="notice-tbody">
                    {currentPosts.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>해당하는 게시글이 없습니다.</td>
                        </tr>
                    ) : (
                        currentPosts.map((notice, index) => {
                            // 필터링된 게시글의 역순 인덱스를 계산
                            const reversedFilteredIndex = currentPosts.length - index;

                            return (
                                <tr
                                    key={notice.id || `notice-${index}`}
                                    onClick={() => goToDetailPage(notice)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{reversedFilteredIndex}</td> {/* 필터링 후 역순 번호 */}
                                    <td>{notice.title}</td>
                                    <td>{formatDate(notice.createdDate)}</td>
                                    <td>{notice.writer}</td>
                                    <td>
                                        {notice.fileUrlId ? (
                                            <span className="notice-attachment-icon"><MdAttachFile /></span>
                                        ) : (
                                            <span className="notice-attachment-icon"><BsFileExcel /></span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            {/* 페이지네이션 버튼 */}
            <div className="pagination">
                <Button
                    className="pagination-nav-button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || notice.length === 0}
                >
                    <HiChevronDoubleLeft />
                </Button>
                <Button
                    className="pagination-nav-button"
                    onClick={handlePrevBlock}
                    disabled={currentPage === 1 || notice.length === 0}
                >
                    <HiChevronLeft />
                </Button>
                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
                    <Button
                        key={startPage + idx}
                        className={`pagination-number ${currentPage === startPage + idx ? "selected" : ""}`}
                        onClick={() => handlePageClick(startPage + idx)}
                    >
                        {startPage + idx}
                    </Button>
                ))}
                <Button
                    className="pagination-nav-button"
                    onClick={handleNextBlock}
                    disabled={currentPage === totalPages || notice.length === 0}
                >
                    <HiChevronRight />
                </Button>
                <Button
                    className="pagination-nav-button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || notice.length === 0}
                >
                    <HiChevronDoubleRight />
                </Button>
            </div>
        </div>
    );
}

export default NoticeList;
