import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import RegionalCommunityComments from './RegionalCommunityComments'; // 댓글 컴포넌트 추가
import "../../../css/community/RegionalCommunityDetail.css"; 
import { useAuth } from "../../sign/AuthContext";  

const RegionalCommunityDetail = () => {
  const { id: postId } = useParams(); // URL에서 postId를 가져옵니다.
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AuthContext에서 인증 상태와 권한 정보 가져오기
  const { isAuth, isAdmin, token } = useAuth();

  useEffect(() => {
    // 지역 커뮤니티 게시글 상세 조회 요청
    axios.get(`${SERVER_URL}regions/list/${postId}`)
      .then((response) => {
        setPost(response.data);
        setLoading(false); // 데이터를 가져온 후 로딩 상태를 false로 변경
      })
      .catch((error) => {
        console.error('게시글 조회 실패:', error);
        setLoading(false); // 에러 발생 시에도 로딩 상태를 false로 변경
      });
  }, [postId]);

  // 게시글 삭제 처리
  const handleDelete = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      axios.delete(`${SERVER_URL}regions/delete/${postId}` , {
        headers: {
          Authorization: `${token}`,
        }
      })
        .then(() => {
          alert('게시글이 삭제되었습니다.');
          // 삭제 후 전체 게시물 조회 페이지로 이동
          navigate('/community/regions');
        })
        .catch((error) => {
          console.error('게시글 삭제 실패:', error);
          alert('게시글 삭제에 실패했습니다.');
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="regioncommunitydetail-container">
      <h2>{post.title}</h2>
      <table className="regioncommunity-detail-table">
        <tbody>
          <tr>
            <th>작성자</th>
            <td>{post.author}</td>
          </tr>
          <tr>
            <th>작성일자</th>
            <td>{new Date(post.createdDate).toLocaleString()}</td>
          </tr>
          <tr>
            <th>지역</th>
            <td>{post.region}</td>
          </tr>
          <tr>
            <td colSpan="2" className="regionCommunitypost-content">{post.content}</td>
          </tr>
        </tbody>
      </table>
      <div className="regionCommunityDetailbutton-group">
        {/* 수정 버튼 */}
      {isAuth && (
          <button onClick={() => navigate(`/community/regions/edit/${post.id}`)} className="regionCommunityDetailedit-btn">
          수정
        </button>
      )}
      {/* 삭제 버튼 */}
      {isAuth && (
        <button onClick={handleDelete} className="regionCommunityDetaildelete-btn">
        삭제
      </button>
      )}


        {/* 뒤로 가기 버튼 */}
        <button onClick={() => navigate('/community/regions')} className="regionCommunityDetailback-btn">
          뒤로 가기
        </button>
      </div>

      {/* 댓글 컴포넌트 */}
      <RegionalCommunityComments communityPostId={postId} />
    </div>
  );
};

export default RegionalCommunityDetail;