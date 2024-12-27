import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/community/RegionalCommunityComments.css";

const RegionalCommunityComments = ({ communityPostId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const { memberId, token, isAdmin, isBoardAdmin } = useAuth(); // 로그인 사용자 ID 및 토큰 가져오기

  // 댓글 가져오기
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}comments/regionalCommunity/${communityPostId}`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글을 가져오지 못했습니다.', error);
    }
  };

  // 댓글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // 작성 확인.
    const isConfirmed = window.confirm("댓글을 작성하시겠습니까?");
    if (!isConfirmed) return;

    const commentData = {
      content,
      author: memberId, // 로그인한 사용자 ID를 작성자로 설정
      regionalCommunityId: communityPostId,
    };

    try {
      await axios.post(`${SERVER_URL}comments`, commentData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setContent('');
      fetchComments(); // 댓글 작성 후 새로고침
    } catch (error) {
      console.error('댓글 작성 실패', error);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    // 삭제 확인.
    const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`${SERVER_URL}comments/${commentId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      fetchComments(); // 삭제 후 새로고침
    } catch (error) {
      console.error('댓글 삭제 실패', error);
    }
  };

  return (
    <div className="regionCommunitycomments-section">
      <h3>댓글</h3>
      <ul className="regionCommunitycomments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="regionCommunitycomment-item">
            <span className="regionCommunitycomment-content">
              <strong>{comment.author}</strong>: {comment.content}
            </span>
            {(comment.author === memberId || isAdmin || isBoardAdmin) && (
              <button
                className="regionCommunitydelete-comment-btn"
                onClick={() => handleDelete(comment.id)}
              >
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="regionCommunityadd-comment-section">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">댓글 작성</button>
      </form>
    </div>
  );
};

export default RegionalCommunityComments;
