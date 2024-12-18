import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../../Constants';
import { useAuth } from "../../sign/AuthContext";
import '../../../css/community/NoticeList.css';

const NoticeList = () => {
  const [notices, setNotices] = useState([]); // 공지사항 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [searchType, setSearchType] = useState("title"); // 검색 타입 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const noticesPerPage = 8;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // 공지사항 불러오기
  const loadNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}notices/list`);
      setNotices(response.data || []);
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 검색 기능
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}notices/search`, {
        params: { keyword: searchTerm, type: searchType },
      });
      setNotices(response.data || []);
      setCurrentPage(1); // 페이지 초기화
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(notices.length / noticesPerPage);
  const currentNotices = notices.slice(
    (currentPage - 1) * noticesPerPage,
    currentPage * noticesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="communitynotice-list-container">
      <h2>공지사항 목록</h2>

      {/* 검색 입력창 및 버튼 */}
      <div className="CommunitySearchContainer">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="CommunitySearchSelect"
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>

        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="CommunitySearchInput"
        />

        <button onClick={handleSearch} className="CommunitySearchButton">
          검색
        </button>
      </div>

      {/* 글 작성 버튼 */}
      {isAdmin && (
        <button
          onClick={() => navigate('/community/notices/create')}
          className="communitycreate-button"
        >
          글 작성
        </button>
      )}

      {/* 공지사항 테이블 */}
      <table className="communitynotice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {currentNotices.length > 0 ? (
            currentNotices.map((notice, index) => (
              <tr
                key={notice.id}
                onClick={() => navigate(`/community/notices/${notice.id}`)}
              >
                <td>
                  {notices.length - ((currentPage - 1) * noticesPerPage + index)}
                </td>
                <td>{notice.title}</td>
                <td>{"관리자"}</td>
                <td>{notice.viewCount}</td>
                <td>{new Date(notice.createdDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            className={`pagination-button ${
              currentPage === page ? 'active' : ''
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticeList;
