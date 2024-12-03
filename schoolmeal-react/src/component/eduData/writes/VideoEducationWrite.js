import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduWrite.css"; // 스타일시트 적용

function VideoEducationWrite() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [videoFile, setVideoFile] = useState(null); // 비디오 파일 상태
    const [thumbnailFile, setThumbnailFile] = useState(null); // 썸네일 파일 상태
    const [thumbnailPreview, setThumbnailPreview] = useState(null); // 썸네일 미리보기 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate();

    // 비디오 파일 입력 변경 핸들러
    const handleVideoFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    // 썸네일 파일 입력 변경 핸들러
    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setThumbnailPreview(fileURL); // 미리보기 업데이트
        }
        setThumbnailFile(file);
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);

        // 비디오 파일이 있을 때만 formData에 비디오 파일 추가
        if (videoFile) {
            formData.append("video", videoFile); // 'video' 필드명으로 비디오 파일 추가
        }

        // 썸네일 파일이 있을 때만 formData에 썸네일 파일 추가
        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile); // 'thumbnail' 필드명으로 썸네일 파일 추가
        }

        // POST 요청
        axios
            .post(`${SERVER_URL}videoEducation/writepro`, formData, {
                headers: {
                    // 'Content-Type'은 Axios가 자동으로 처리함
                },
            })
            .then((response) => {
                window.alert("게시글이 성공적으로 등록되었습니다.");
                navigate("/eduData/video-education"); // 성공 시 목록 페이지로 이동
            })
            .catch((err) => {
                console.error("게시글 등록 중 오류가 발생했습니다.", err);
                setError("게시글 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            })
            .finally(() => {
                setLoading(false); // 로딩 상태 종료
            });
    };

    return (
        <div className="edu-write-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>새 게시글 작성</h2>
                    {error && <div className="edu-error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="edu-form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="edu-form-group">
                            <TextField
                                label="작성자"
                                fullWidth
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
                                required
                            />
                        </div>

                        <div className="edu-form-group">
                            <TextField
                                label="내용"
                                fullWidth
                                multiline
                                rows={5}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        {/* 비디오 파일 업로드 */}
                        <div className="edu-form-group">
                            <label>영상 파일:</label>
                            <input
                                type="file"
                                accept="video/*" // 비디오 파일만 허용
                                onChange={handleVideoFileChange}
                            />
                        </div>

                        {/* 썸네일 미리보기 */}
                        <div className="edu-form-group">
                            <label>썸네일 이미지:</label>
                            <input
                                type="file"
                                accept="image/*" // 썸네일 이미지 파일만 허용
                                onChange={handleThumbnailFileChange}
                            />
                            {thumbnailPreview && (
                                <div className="edu-writer-thumbnail-container img">
                                    <h4>미리보기:</h4>
                                    <img
                                        src={thumbnailPreview}
                                        alt="썸네일 미리보기"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="edu-button-group">
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
                                onClick={() => navigate("/eduData/video-education")}
                            >
                                목록
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VideoEducationWrite;
