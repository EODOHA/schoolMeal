import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { Button } from '@mui/material';
import RegionalCommunityComments from './RegionalCommunityComments';
import "../../../css/community/RegionalCommunityDetail.css";
import LoadingSpinner from '../../common/LoadingSpinner';

const RegionalCommunityDetail = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // AuthContext에서 인증 상태와 권한 정보 가져오기
  const { memberId, role, token, isAuth } = useAuth();

  useEffect(() => {
    // 게시글 상세 조회
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}regions/list/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("게시글 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // 권한 판단 함수
  const canEditOrDelete = () => {

    return role === "ADMIN" || role === "BOARDADMIN" || post?.author === memberId; // ADMIN, BOARDADMIN, 작성자인 경우

  };

  // 게시글 삭제 처리
  const handleDelete = async () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${SERVER_URL}regions/delete/${postId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        alert("게시글이 삭제되었습니다.");
        navigate("/community/regions"); // 삭제 후 목록으로 이동
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return <div>
      <LoadingSpinner />
    </div>;
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
        {(isAuth && canEditOrDelete()) && (
          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate(`/community/regions/edit/${post.id}`)}
          >
            수정
          </Button>
        )}
        {/* 뒤로 가기 버튼 */}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/community/regions")}
        >
          목록
        </Button>

        {/* 삭제 버튼 */}
        {(isAuth && canEditOrDelete()) && (
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            삭제
          </Button>
        )}

      </div>

      {/* 댓글 컴포넌트 */}
      <RegionalCommunityComments communityPostId={postId} />
    </div>
  );
};

export default RegionalCommunityDetail;
