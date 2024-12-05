import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import "../../../css/community/ProcessedFoodComments.css"; 

const ProcessedFoodComments = ({ foodId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');

    // 댓글 가져오기
    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            // 서버와의 경로를 일치하도록 수정
            const response = await axios.get(`${SERVER_URL}comments/processedFood/${foodId}`);
            setComments(response.data);
        } catch (error) {
            console.error('댓글을 가져오지 못했습니다.', error);
            alert('댓글을 가져오는 데 실패했습니다. 서버와의 연결을 확인하세요.');
        }
    };

    // 댓글 작성
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const commentData = {
            content,
            author: '테스트 사용자', // 사용자 정보 필요
            processedFoodId: foodId,
        };

        try {
            await axios.post(`${SERVER_URL}comments`, commentData);
            setContent('');
            fetchComments(); // 댓글 작성 후 새로고침
        } catch (error) {
            console.error('댓글 작성 실패', error);
            alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 댓글 삭제
    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`${SERVER_URL}comments/${commentId}`);
            fetchComments(); // 삭제 후 새로고침
        } catch (error) {
            console.error('댓글 삭제 실패', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="processedFoodcomments-section">
            <h3>댓글</h3>
            <ul className="processedFoodcomments-list">
                {comments.map((comment) => (
                    <li key={comment.id} className="processedFoodcomment-item">
                        <span className="processedFoodcomment-content">
                            <strong>{comment.author}</strong>: {comment.content}
                        </span>
                        <button
                            className="processedFoodCommentdelete-comment-btn"
                            onClick={() => handleDelete(comment.id)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className="processedFoodCommentadd-comment-section">
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

export default ProcessedFoodComments;
