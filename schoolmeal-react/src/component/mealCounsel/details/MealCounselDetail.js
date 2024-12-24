import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../sign/AuthContext';
import { SERVER_URL } from '../../../Constants';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/mealCounsel/MealCounselDetail.css';
import Button from '@mui/material/Button';

const MealCounselDetail = () => {
  const { id: Id } = useParams();
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}mealcounsel/list${Id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        console.error('게시글을 불러오는 데 실패했습니다:', err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [Id, token]);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${SERVER_URL}mealcounsel/delete${Id}`, {
          headers: { Authorization: token },
        });
        alert('게시글이 성공적으로 삭제되었습니다.');
        navigate('/mealcounsel/list');
      } catch (err) {
        console.error('게시글 삭제 중 오류:', err);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/mealcounsel/edit/${Id}`);
  };

  const handleBack = () => {
    navigate('/mealcounsel/list');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? '유효하지 않은 날짜'
      : `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) return <div>데이터를 로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="meal-detail-container">
      <div className="meal-card">
        <div className="meal-card-body">
          <h2>{post.title}</h2>
          <hr />
          <div className="meal-header">
            <div className="meal-id">ID: {post.id}</div>
            <div className="meal-date">작성일: {formatDate(post.createdAt)}</div>
          </div>
          <p>{post.content}</p>

          {post.youtubeHtml && (
            <div
              className="meal-youtube-video"
              dangerouslySetInnerHTML={{ __html: post.youtubeHtml }}
            ></div>
          )}

          {post.files && post.files.length > 0 && (
            <div className="meal-files">
              <h3>첨부 파일</h3>
              <ul>
                {post.files.map((file) => (
                  <li key={file.id}>
                    <a
                      href={`${SERVER_URL}mealcounsel/files/${file.id}`}
                      download
                      className="meal-attachment-link"
                    >
                      {file.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="meal-button-group">
            {isAdmin && (
              <>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                  수정
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete}>
                  삭제
                </Button>
              </>
            )}
            <Button variant="text" onClick={handleBack}>
              목록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCounselDetail;