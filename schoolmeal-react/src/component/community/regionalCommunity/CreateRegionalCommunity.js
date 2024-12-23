import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/community/CreateRegionalCommunity.css";

const CreateRegionalCommunity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('SEOUL');
  const [author, setAuthor] = useState(''); // 작성자 상태 추가
  const { isAuth, token } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPostToEdit(id);
    }
  }, [id]);

  const fetchPostToEdit = async (postId) => {
    try {
      const response = await axios.get(`${SERVER_URL}regions/list/${postId}`);
      const { title, content, region, author } = response.data;
      setTitle(title);
      setContent(content);
      setRegion(region);
      setAuthor(author); // 기존 작성자 데이터 설정
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      author, // 작성자 이름 추가
      region,
    };

    try {
      if (id) {
        await axios.put(`${SERVER_URL}regions/update/${id}`, postData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert('지역별 커뮤니티 게시글이 수정되었습니다.');
      } else {
        await axios.post(`${SERVER_URL}regions/create`, postData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert('지역별 커뮤니티 게시글이 작성되었습니다.');
      }
      navigate('/community/regions');
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
          <label>작성자:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)} // 작성자 입력
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
        <div className="regionCommunityform-group">
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
         
        <button type="submit" className="regionCommunityCrudSubmit-btn">
          {id ? '게시글 수정하기' : '게시글 작성하기'}
        </button>
      </form>
    </div>
  );
};

export default CreateRegionalCommunity;
