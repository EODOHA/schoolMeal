// src/components/mealCounsel/writes/MealCounselWrite.js
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../../sign/AuthContext';
import { SERVER_URL } from '../../../Constants';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../../../css/mealCounsel/MealCounselWrite.css';
import LoadingSpinner from '../../common/LoadingSpinner';

const MealCounselWrite = () => {
    const navigate = useNavigate();
    const { isAuth, isAdmin, isBoardAdmin, token, role, memberId } = useAuth();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState('');
    const [youtubeHtml, setYoutubeHtml] = useState('');
    const [files, setFiles] = useState([]); // 상태: 다중 파일 업로드 관리
    const [loading, setLoading] = useState(false); // 상태: 로딩 표시
    const [error, setError] = useState(null); // 상태: 에러 메시지 관리
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 상태: 인증 상태 로딩

    /**
     * 파일 선택 시 호출되는 함수
     * 최대 5개의 파일만 선택할 수 있도록 제한
     */
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 5) {
            alert('최대 5개의 파일만 첨부할 수 있습니다.');
            return;
        }
        setFiles(selectedFiles);
    };

    /**
     * 선택된 파일 목록에서 특정 파일을 제거하는 함수
     */
    const removeFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    /**
     * 게시글 작성 폼 제출 시 호출되는 함수
     * 게시글 데이터를 서버로 전송하여 저장
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // 이전 에러 메시지 초기화

        // 제목과 내용이 비어있지 않은지 확인
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            setLoading(false);
            return;
        }

        // FormData 객체 생성하여 multipart/form-data 형식으로 데이터 준비
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('youtubeHtml', youtubeHtml);
        formData.append('author',author);

        // 선택된 파일들을 FormData에 추가
        files.forEach(file => {
            formData.append('files', file); // 'files' 필드로 다중 파일 추가
        });

        try {
            // 백엔드 엔드포인트로 POST 요청 전송
            await axios.post(`${SERVER_URL}mealcounsel/writepost`, formData, { // SERVER_URL
                headers: {
                    Authorization: `${token}`, // 인증 토큰 Bearer 스킴 사용
                },
            });
            window.alert("게시글이 성공적으로 등록되었습니다.");
            navigate("/mealcounsel/list"); // 성공 시 게시글 목록 페이지로 이동
        } catch (err) {
            console.error("게시글 등록 중 오류가 발생했습니다.", err);
            setError("게시글 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    /**
     * 사용자의 역할에 따라 작성자 설정
     * 관리자 또는 담당자인 경우 해당 역할을 설정
     */
    useEffect(() => {
        let authorRole = role;
        if (isAdmin) {
            authorRole = "관리자";
        } else if (isBoardAdmin) {
            authorRole = "담당자";
        }
        setAuthor(authorRole);
    }, [memberId, role, isAdmin, isBoardAdmin]);

    /**
     * 인증 상태가 로드되었는지 확인하는 함수
     * 인증 상태와 권한 정보가 모두 로드되면 로딩 상태를 종료
     */
    useEffect(() => {
        if (isAuth !== undefined && isAdmin !== undefined && isBoardAdmin !== undefined) {
            setIsLoadingAuth(false); // 인증 상태 로딩 완료
        }
    }, [isAuth, isAdmin, isBoardAdmin]);

    /**
     * 인증되지 않은 사용자는 'unauthorized' 페이지로 리다이렉트
     */
    useEffect(() => {
        if (!isLoadingAuth && (!isAuth || (!isAdmin && !isBoardAdmin))) {
            navigate("/unauthorized");
        }
    }, [isAuth, isAdmin, isBoardAdmin, isLoadingAuth, navigate]);

    // 인증 상태가 로딩 중일 때 로딩 스피너 표시
    if (isLoadingAuth) {
        return <div><LoadingSpinner /></div>;
    }

    /**
     * 게시글 작성 취소 시 게시글 목록 페이지로 이동하는 함수
     */
    const handleCancel = () => {
        navigate('/mealcounsel/list'); 
    };

    return (
        <div className="meal-write-container">
            <div className="meal-card">
                <div className="meal-card-body">
                    <h2>새 게시글 작성</h2>
                    {/* 에러 메시지 표시 */}
                    {error && <div className="meal-error-message">{error}</div>}
                    <form onSubmit={handleSubmit} className="meal-write-form">
                        <div className="meal-form-group">
                            <label>제목:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                maxLength="100"
                                placeholder="제목을 입력하세요."
                            />
                        </div>
                        <div className="meal-form-group">
                            <label htmlFor="content">내용:</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                maxLength="2000"
                                rows="5"
                                placeholder="내용을 입력하세요."
                            ></textarea>
                        </div>
                        <div className="meal-form-group">
                            <label htmlFor="youtubeHtml">YouTube HTML:</label>
                            <textarea
                                id="youtubeHtml"
                                value={youtubeHtml}
                                onChange={(e) => setYoutubeHtml(e.target.value)}
                                placeholder="<iframe ...></iframe>"
                                rows="3"
                            ></textarea>
                        </div>
                        {/* 파일 첨부 섹션 */}
                        <div className="meal-form-group">
                            <label>첨부 파일:</label>
                            <input type="file" onChange={handleFileChange} multiple />
                            {files.length > 0 && (
                                <div className="selected-files">
                                    <p>선택된 파일:</p>
                                    <ul>
                                        {files.map((file, index) => (
                                            <li key={index}>
                                                {file.name} 
                                                <button type="button" onClick={() => removeFile(index)}>삭제</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* 게시글 작성 및 취소 버튼 */}
                        <div className="meal-button-group">
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "등록 중..." : "등록"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                type="button"
                                onClick={handleCancel}
                            >
                                목록
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MealCounselWrite;
