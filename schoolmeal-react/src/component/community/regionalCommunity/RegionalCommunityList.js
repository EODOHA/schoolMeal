import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import "../../../css/community/RegionalCommunityList.css"; 

const RegionalCommunityList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('ALL'); // 기본값은 전체 조회
  const navigate = useNavigate();

  // 지역별 커뮤니티 게시글 목록을 서버에서 불러오는 함수
  const loadPosts = async (region) => {
    setLoading(true);
    try {
      let response;
      if (region === 'ALL') {
        response = await axios.get(`${SERVER_URL}regions/list`); // 서버 매핑 주소에 맞춤
      } else {
        response = await axios.get(`${SERVER_URL}regions/list/category/${region}`); // 서버 매핑 주소에 맞춤
      }
      const sortedPosts = (response.data || []).sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('지역 커뮤니티 게시글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(selectedRegion); // 초기에는 전체 게시글을 가져옵니다.
  }, [selectedRegion]);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    loadPosts(region); // 선택한 지역에 맞는 게시글을 로드합니다.
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="community-list-container">
      <h2>지역별 커뮤니티 게시글 목록</h2>
      
      {/* 지역 선택 드롭다운 */}
      <div className="region-filter">
        <label>지역 선택: </label>
        <select value={selectedRegion} onChange={handleRegionChange}>
          <option value="ALL">전체</option>
          <option value="SEOUL">서울</option>
          <option value="DAEJEON">대전</option>
          <option value="INCHEON">인천</option>
          <option value="BUSAN">부산</option>
          <option value="GANGWONDO">강원도</option>
        </select>
      </div>

      <table className="regioncommunity-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>지역</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post, index) => (
              <tr key={post.id} onClick={() => navigate(`/community/regions/${post.id}`)}>
                <td>{posts.length - index}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.region}</td>
                <td>{new Date(post.createdDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => navigate('/community/regions/create')} className="regionCommunitylistcreate-button">커뮤니티 글 작성</button>
    </div>
  );
};

export default RegionalCommunityList;