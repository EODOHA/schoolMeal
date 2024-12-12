import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from '../../../Constants';
import { useAuth } from "../../sign/AuthContext";
import '../../../css/community/CreateNotice.css';

const CreateNotice = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정할 게시글의 ID를 가져옵니다.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author] = useState(''); // 
  const [file, setFile] = useState(null);

      // AuthContext에서 인증 상태와 권한 정보 가져오기
      const { isAuth, isAdmin, token } = useAuth();

  useEffect(() => {
    if (id) {
      // 수정 모드일 때 공지사항 데이터를 가져옴
      fetchNoticeToEdit(id);
    }
  }, [id]);

  const fetchNoticeToEdit = async (noticeId) => {
    try {
      const response = await axios.get(`${SERVER_URL}notices/list/${noticeId}`);
      const { title, content } = response.data;
      setTitle(title);
      setContent(content);
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noticeData = {
      title,
      content,
      author,
    };

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }

    try {
      if (id) {
        // 수정 모드일 때 PUT 요청으로 공지사항 업데이트
        await axios.put(`${SERVER_URL}notices/update/${id}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert('공지사항이 수정되었습니다.');
      } else {
        // 작성 모드일 때 POST 요청으로 새로운 공지사항 작성
        await axios.post(`${SERVER_URL}notices/create`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert('공지사항이 작성되었습니다.');
      }
      navigate('/community/notices'); // 수정 또는 작성 후 공지사항 목록으로 이동
    } catch (error) {
      console.error('공지사항 요청 실패:', error);
      alert('공지사항 요청에 실패했습니다.');
    }
  };

  return (
    <div className="communityNoticeform-container">
      <h2>{id ? '공지사항 수정' : '공지사항 작성'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="communityNoticeform-group">
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="communityNoticeform-group">
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="communityNoticeform-group">
          <label>첨부 파일:</label>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="communityNoticesubmit-btn">
          {id ? '공지사항 수정하기' : '공지사항 작성하기'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotice;
