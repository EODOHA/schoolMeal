import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext"; // AuthContext 사용
import { Button } from '@mui/material';
import "../../../css/community/CreateRegionalCommunity.css";

const CreateRegionalCommunity = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 id 가져오기
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('SEOUL');
  const [author, setAuthor] = useState(''); // 작성자 상태 추가
  const { memberId, token } = useAuth(); // 로그인 정보 가져오기

  useEffect(() => {
    if (id) {
      fetchPostToEdit(id);
    } else {
      // 새 게시글 작성 시 작성자를 로그인한 사용자로 설정
      setAuthor(memberId);
    }
  }, [id, memberId]);

  const fetchPostToEdit = async (postId) => {
    try {
      const response = await axios.get(`${SERVER_URL}regions/list/${postId}`);
      const { title, content, region, author } = response.data;
      setTitle(title);
      setContent(content);
      setRegion(region);
      setAuthor(author); // 수정 시 기존 작성자 정보를 유지
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      author, // 작성자는 변경되지 않고 유지됨
      region,
    };

    try {
      if (id) {
        // 수정 요청
        await axios.put(`${SERVER_URL}regions/update/${id}`, postData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert("지역별 커뮤니티 게시글이 수정되었습니다.");
      } else {
        // 새 게시글 작성 요청
        await axios.post(`${SERVER_URL}regions/create`, postData, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert("지역별 커뮤니티 게시글이 작성되었습니다.");
      }
      navigate("/community/regions");
    } catch (error) {
      console.error("게시글 요청 실패:", error);
      alert("게시글 요청에 실패했습니다.");
    }
  };

  return (
    <div className="regionCommunityform-container">
      <h2>{id ? "커뮤니티 게시글 수정" : "커뮤니티 게시글 작성"}</h2>
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
            value={author} // 작성자를 표시
            readOnly // 작성자 수정 불가
          />
        </div>
        <div className="regionCommunityform-group">
          <label>지역 선택:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="ALL">전체</option>
            <option value="SEOUL">서울특별시</option>
            <option value="BUSAN">부산광역시</option>
            <option value="DAEGU">대구광역시</option>
            <option value="INCHEON">인천광역시</option>
            <option value="GWANGJU">광주광역시</option>
            <option value="DAEJEON">대전광역시</option>
            <option value="ULSAN">울산광역시</option>
            <option value="SEJONG">세종특별자치시</option>
            <option value="GANGWON">강원특별자치도</option>
            <option value="GYEONGGI">경기도</option>
            <option value="CHUNGBUK">충청북도</option>
            <option value="CHUNGNAM">충청남도</option>
            <option value="JEONBUK">전북특별자치도</option>
            <option value="JEONNAM">전라남도</option>
            <option value="GYEONGBUK">경상북도</option>
            <option value="GYEONGNAM">경상남도</option>
            <option value="JEJU">제주특별자치도</option>
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
        <div className='regionCommunityCrudSubmit-btn'>
          <Button
            variant="contained"
            color="success"
            type="submit"
          >
            {id ? "게시글 수정하기" : "게시글 작성하기"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/community/regions")}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRegionalCommunity;
