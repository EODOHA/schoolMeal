import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../sign/AuthContext';
import { SERVER_URL } from '../../../Constants';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/mealCounsel/MealCounselEdit.css';
import Button from '@mui/material/Button';

const MealCounselEdit = () => {
  const { id: Id } = useParams();
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeHtml, setYoutubeHtml] = useState('');
  const [files, setFiles] = useState([]); // 기존 첨부 파일 정보
  const [newFiles, setNewFiles] = useState([]); // 새로 업로드할 파일
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}mealcounsel/list/${Id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setYoutubeHtml(post.youtubeHtml);
        setFiles(post.files || []); // 기존 첨부 파일 설정
      } catch (error) {
        alert('게시글을 불러오는 데 실패했습니다.');
      }
    };
    fetchPost();
  }, [Id, token]);

  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('youtubeHtml', youtubeHtml);
    newFiles.forEach((file) => formData.append('files', file)); // 새 파일 추가

    try {
      await axios.put(`${SERVER_URL}mealcounsel/edit/${Id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/mealcounsel/detail/${Id}`);
    } catch (error) {
      setError('게시글 수정 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/mealcounsel/list');
  };

  const handleFileDelete = async (fileId) => {
    if (window.confirm('정말로 이 파일을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${SERVER_URL}mealcounsel/files/${fileId}`, {
          headers: { Authorization: token },
        });
        setFiles(files.filter((file) => file.id !== fileId));
        alert('파일이 삭제되었습니다.');
      } catch (error) {
        alert('파일 삭제 중 문제가 발생했습니다.');
      }
    }
  };

  if (loading) return <div>데이터를 로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="meal-edit-container">
      <h2>게시글 수정</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>YouTube HTML:</label>
          <textarea
            value={youtubeHtml}
            onChange={(e) => setYoutubeHtml(e.target.value)}
          ></textarea>
        </div>
        {files.length > 0 && (
          <div>
            <h3>기존 첨부 파일</h3>
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  <a href={`${SERVER_URL}mealcounsel/files/${file.id}`} download>
                    {file.fileName}
                  </a>
                  {isAdmin && (
                    <button onClick={() => handleFileDelete(file.id)}>삭제</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <label>새 파일 추가:</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <button type="submit">수정</button>
        <button type="button" onClick={handleCancel}>취소</button>
      </form>
    </div>
  );
};

export default MealCounselEdit;