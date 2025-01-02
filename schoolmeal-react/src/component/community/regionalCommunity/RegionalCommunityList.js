import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";  // 권한설정
import Pagination from '@mui/material/Pagination';
import "../../../css/community/RegionalCommunityList.css";
import LoadingSpinner from '../../common/LoadingSpinner';

const RegionalCommunityList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('ALL'); // 기본값은 전체 조회
  const [commentCounts, setCommentCounts] = useState({}); // 댓글 개수.

  // 페이지네이션 관련 상태.
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지.
  const itemsPerPage = 5; // 한 페이지당 보여줄 게시글 수.
  const navigate = useNavigate();

  // AuthContext에서 인증 상태와 권한 정보 가져오기
  const { isAuth } = useAuth();

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

      // 각 게시글에 대한 댓글 개수를 불러오는 요청
      const commentCountPromises = sortedPosts.map(post =>
        axios.get(`${SERVER_URL}comments/regionalCommunity/${post.id}/commentCount`)
      );
      const commentCountResponses = await Promise.all(commentCountPromises);

      // 댓글 개수를 상태에 저장
      const commentCountData = {};
      commentCountResponses.forEach((response, index) => {
        commentCountData[sortedPosts[index].id] = response.data;
      });
      setCommentCounts(commentCountData);

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
    setCurrentPage(1); // 지역 변경 시, 페이지를 첫 페이지로 초기화.
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  // 현재 페이지에 표시할 게시글 계산.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <div><LoadingSpinner /></div>;
  }

  return (
    <div className="community-list-container">
      <h2>지역별 커뮤니티 게시글 목록</h2>

      <div className="filter-container">
        {/* 커뮤니티 글 작성 버튼 */}
        {isAuth && (
          <button onClick={() => navigate('/community/regions/create')} className="regionCommunitylistcreate-button">
            커뮤니티 글 작성
          </button>
        )}

        {/* 지역 선택 드롭다운 */}
        <div className="region-filter">
          <label>지역 선택: </label>
          <select value={selectedRegion} onChange={handleRegionChange} className="region-select">
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
      </div>

      <table className="regioncommunity-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>조회수</th>
            <th>제목</th>
            <th>작성자</th>
            <th>지역</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((post, index) => (
              <tr key={post.id} onClick={() => navigate(`/community/regions/${post.id}`)}>
                <td>{posts.length - (currentPage - 1) * itemsPerPage - index}</td>
                <td>{post.viewCount || 0}</td>
                <td>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>
                    [{commentCounts[post.id] || 0}]
                  </span>{" "}
                  {post.title}
                </td>
                <td>{post.author}</td>
                <td>{post.region}</td>
                <td>{new Date(post.createdDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                {"게시글이 없습니다."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination-buttons" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(posts.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '50%', // 둥근 버튼
              border: '1px solid #e0e0e0', // 연한 테두리
              backgroundColor: '#fff', // 기본 배경색
              '&:hover': {
                backgroundColor: '#52a8ff', // 호버 시 배경색
              },
              '&.Mui-selected': {
                backgroundColor: '#1976d2', // 선택된 페이지 배경
                color: '#fff', // 선택된 페이지 글자 색
              },
            },
            '& .MuiPaginationItem-previousNext': {
              fontSize: '20px', // 이전/다음 아이콘 크기
              padding: '5px', // 간격
            },
            '& .MuiPaginationItem-first, & .MuiPaginationItem-last': {
              fontSize: '20px', // 첫/마지막 아이콘 크기
            },
          }}
        />
      </div>
    </div>
  );
};

export default RegionalCommunityList;