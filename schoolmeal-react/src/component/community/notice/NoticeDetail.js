import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { SERVER_URL } from '../../../Constants';
import { useAuth } from "../../sign/AuthContext";  // 권한설정
import '../../../css/community/NoticeDetail.css';

const NoticeDetail = () => {
  const { id: noticeId } = useParams(); // URL에서 noticeId를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();  // 로그인 상태 확인

  // 공지사항을 가져오는 함수
  const fetchNotice = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}notices/list/${noticeId}`);
      setNotice(response.data);
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 공지사항을 가져옴
  useEffect(() => {
    if (noticeId) {
      fetchNotice();
    } else {
      console.error('공지사항 ID가 정의되지 않았습니다.');
      setLoading(false);
    }
  }, [noticeId]);

  // 공지사항 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${SERVER_URL}notices/delete/${noticeId}`);
        alert('공지사항이 삭제되었습니다.');
        navigate('/community/notices'); // 삭제 후 공지사항 목록으로 돌아가기
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        alert('공지사항 삭제에 실패했습니다.');
      }
    }
  };

  // 공지사항 수정 핸들러
  const handleEdit = () => {
    navigate(`/community/notices/edit/${noticeId}`, { state: { notice } });
  };

  // 파일 다운로드 핸들러
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios({
        url: `${SERVER_URL}notices/download/${fileId}`,
        method: 'GET',
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  // 공지사항이 없는 경우
  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="communityNoticedetail-container">
      <h2>{notice.title}</h2>
      <table className="communitynotice-detail-table">
        <tbody>
          <tr>
            <th>작성자</th>
            <td>{notice.author}</td>
          </tr>
          <tr>
            <th>작성일자</th>
            <td>{new Date(notice.createdDate).toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan="2" className="communitynotice-content">{notice.content}</td>
          </tr>
          {notice.fileId && notice.origFileName && (
            <tr>
              <th>첨부파일</th>
              <td>
                <button
                  onClick={() => handleDownload(notice.fileId, notice.origFileName)}
                  className="communityNoticedownload-btn"
                >
                  {notice.origFileName}
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="communityNoticebutton-group">
        {isAdmin  && (
            <button onClick={handleEdit} className="communityNoticeedit-btn">수정</button>
        )}

        {isAdmin  && (
           <button onClick={handleDelete} className="communityNoticedelete-btn">삭제</button>
        )}
        
       
        <button onClick={() => navigate('/community/notices')} className="communityNoticeback-btn">뒤로 가기</button>
      </div>
    </div>
  );
};

export default NoticeDetail;
