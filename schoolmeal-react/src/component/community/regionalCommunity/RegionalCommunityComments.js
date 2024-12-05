import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import "../../../css/community/RegionalCommunityComments.css"; 

const RegionalCommunityComments = ({ communityPostId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

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

        const commentData = {
            content,
            author: '테스트 사용자', // 사용자 정보 필요
            regionalCommunityId: communityPostId,
        };

        try {
            await axios.post(`${SERVER_URL}comments`, commentData);
            setContent('');
            fetchComments(); // 댓글 작성 후 새로고침
        } catch (error) {
            console.error('댓글 작성 실패', error);
        }
    };

    // 댓글 삭제
    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`${SERVER_URL}comments/${commentId}`);
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
                        <button
                            className="regionCommunitydelete-comment-btn"
                            onClick={() => handleDelete(comment.id)}
                        >
                            삭제
                        </button>
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
