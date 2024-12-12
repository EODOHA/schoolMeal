import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/community/CreateRegionalCommunity.css"; 

const CreateRegionalCommunity = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정할 게시글의 ID를 가져옵니다.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('SEOUL'); // 지역 선택 기본값
  const [author] = useState('테스트 사용자'); // 고정된 작성자 정보

  // AuthContext에서 인증 상태와 권한 정보 가져오기
  const { isAuth, isAdmin, token } = useAuth();

  // 수정 모드일 경우 기존 데이터 설정
  useEffect(() => {
    if (id) {
      fetchPostToEdit(id);
    }
  }, [id]);

  const fetchPostToEdit = async (postId) => {
    try {
      const response = await axios.get(`${SERVER_URL}regions/list/${postId}`);
      const { title, content, region } = response.data;
      setTitle(title);
      setContent(content);
      setRegion(region);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // RegionalCommunityRequestDTO의 데이터 구성
    const postData = {
      title,
      content,
      author,
      region,
    };
  
    try {
      if (id) {
        // 지역별 커뮤니티 게시글 수정 요청
        await axios.put(`${SERVER_URL}regions/update/${id}`, postData ,{
          headers: {
            Authorization: `${token}`,
          },
        }); // 서버 매핑 주소에 맞춤
        alert('지역별 커뮤니티 게시글이 수정되었습니다.');
      } else {
        // 지역별 커뮤니티 게시글 작성 요청
        await axios.post(`${SERVER_URL}regions/create`, postData, {
          headers: {
            Authorization: `${token}`,
          },
        }); // 서버 매핑 주소에 맞춤
        alert('지역별 커뮤니티 게시글이 작성되었습니다.');
      }
      navigate('/community/regions'); // 작성 또는 수정 후 전체 목록으로 이동
    } catch (error) {
      console.error('게시글 요청 실패:', error);
      alert('게시글 요청에 실패했습니다.');
    }
  };

  return (
    <div className="regionCommunityform-container">
      <h2>{id ? '커뮤니티 게시글 수정' : '커뮤니티 게시글 작성'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="regionCommunityform-group">
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="regionCommunityform-group">
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="regionCommunityform-group">
          <label>지역 선택:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="SEOUL">서울</option>
            <option value="DAEJEON">대전</option>
            <option value="INCHEON">인천</option>
            <option value="BUSAN">부산</option>
            <option value="GANGWONDO">강원도</option>
          </select>
        </div>
        <button type="submit" className="regionCommunityCrudSubmit-btn">
          {id ? '게시글 수정하기' : '게시글 작성하기'}
        </button>
      </form>
    </div>
  );
};

export default CreateRegionalCommunity;