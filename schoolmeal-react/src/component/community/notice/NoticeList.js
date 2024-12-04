import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../../Constants';
import '../../../css/community/NoticeList.css'; // 스타일 적용을 위한 경로 (수정 필요 시 사용자에 맞게 조정하세요)

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 공지사항 목록을 서버에서 불러오는 함수
  const loadNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}notices/list`);
      const sortedNotices = (response.data || []).sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setNotices(sortedNotices);
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="communitynotice-list-container">
      <h2>공지사항 목록</h2>
      <button onClick={() => navigate('/community/notices/create')} className="communitycreate-button">
        글 작성
      </button>
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
          {Array.isArray(notices) && notices.length > 0 ? (
            notices.map((notice, index) => (
              <tr key={notice.id} onClick={() => navigate(`/community/notices/${notice.id}`)}>
                <td>{notices.length - index}</td>
                <td>{notice.title}</td>
                <td>{notice.author}</td>
                <td>{notice.viewCount}</td>
                <td>{new Date(notice.createdDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">공지사항이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NoticeList;
