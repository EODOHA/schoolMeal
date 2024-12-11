import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../../Constants';
import '../../../css/community/NoticeList.css'; // 스타일 파일 경로

const NoticeList = () => {
  // 상태 관리
  const [notices, setNotices] = useState([]); // 공지사항 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const noticesPerPage = 8; // 한 페이지에 표시할 공지사항 수
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이터

  // 공지사항 목록을 서버에서 불러오는 함수
  const loadNotices = async () => {
    setLoading(true); // 로딩 상태를 true로 설정
    try {
      // 서버에서 공지사항 데이터 가져오기
      const response = await axios.get(`${SERVER_URL}notices/list`);
      
      // 날짜 기준으로 공지사항 정렬 (최신순)
      const sortedNotices = (response.data || []).sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setNotices(sortedNotices); // 상태에 정렬된 데이터 저장
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error); // 에러 로그 출력
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정
    }
  };

  // 컴포넌트가 처음 렌더링될 때 공지사항 불러오기
  useEffect(() => {
    loadNotices();
  }, []); // 빈 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행

  // 페이지네이션 관련 변수
  const totalPages = Math.ceil(notices.length / noticesPerPage); // 전체 페이지 수 계산
  const currentNotices = notices.slice(
    (currentPage - 1) * noticesPerPage,
    currentPage * noticesPerPage
  ); // 현재 페이지에 표시할 공지사항 슬라이싱

  // 페이지 변경 처리
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 선택한 페이지 번호를 상태로 설정
  };

  // 로딩 중일 때 표시
  if (loading) {
    return <div>Loading...</div>; // 데이터 로드 중일 때 표시할 메시지
  }

  return (
    <div className="communitynotice-list-container">
      {/* 페이지 제목 */}
      <h2>공지사항 목록</h2>

      {/* 글 작성 버튼 */}
      <button
        onClick={() => navigate('/community/notices/create')}
        className="communitycreate-button"
      >
        글 작성
      </button>

      {/* 공지사항 목록 테이블 */}
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
          {Array.isArray(currentNotices) && currentNotices.length > 0 ? (
            // 공지사항이 있을 때 목록 표시
            currentNotices.map((notice, index) => (
              <tr
                key={notice.id} // 각 행의 고유 키
                onClick={() => navigate(`/community/notices/${notice.id}`)} // 클릭 시 상세 페이지로 이동
              >
                <td>{notices.length - ((currentPage - 1) * noticesPerPage + index)}</td>
                <td>{notice.title}</td>
                <td>{notice.author}</td>
                <td>{notice.viewCount}</td>
                <td>{new Date(notice.createdDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            // 공지사항이 없을 때 메시지 표시
            <tr>
              <td colSpan="5">공지사항이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 UI */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page} // 각 버튼의 고유 키
            className={`pagination-button ${currentPage === page ? 'active' : ''}`} // 현재 페이지 스타일 적용
            onClick={() => handlePageChange(page)} // 버튼 클릭 시 페이지 변경
          >
            {page} {/* 페이지 번호 표시 */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticeList;
