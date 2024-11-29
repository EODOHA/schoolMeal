import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduEdit.css"; // 스타일시트 적용

function VideoEducationEdit() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null); // 썸네일 파일 상태
    const [thumbnailPreview, setThumbnailPreview] = useState(null); // 썸네일 미리보기 상태
    const [existingThumbnail, setExistingThumbnail] = useState(""); // 기존 썸네일 URL 상태
    const [videoFile, setVideoFile] = useState(null); // 영상 파일 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate();
    const { id } = useParams(); // URL에서 id 추출

    // 기존 데이터 로드 (수정할 때)
    useEffect(() => {
        axios
            .get(`${SERVER_URL}videoEducation/${id}`)
            .then((response) => {
                const data = response.data;
                setTitle(data.title);
                setWriter(data.writer);
                setContent(data.content);
                setExistingThumbnail(data.imageUrl); // 기존 썸네일 URL 설정
            })
            .catch((err) => {
                console.error("데이터 로드 중 오류가 발생했습니다.", err);
                setError("게시판 데이터를 불러오는 데 실패했습니다.");
            });
    }, [id]);

    // 썸네일 파일 입력 변경 핸들러
    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setThumbnailPreview(fileURL); // 미리보기 업데이트
        }
        setThumbnailFile(file);
    };

    // 영상 파일 입력 변경 핸들러
    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);

        // 썸네일 파일이 있을 때만 formData에 썸네일 파일 추가
        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        } else if (existingThumbnail) {
            // 기존 썸네일이 있다면 URL을 그대로 추가
            formData.append("thumbnail", existingThumbnail);
        }

        // 영상 파일이 있을 때만 formData에 영상 파일 추가
        if (videoFile) {
            formData.append("video", videoFile);
        }

        // PUT 요청
        axios
            .put(`${SERVER_URL}videoEducation/update/${id}`, formData)
            .then((response) => {
                window.alert("게시판이 성공적으로 수정되었습니다.");
                navigate("/eduData/video-education"); // 성공 시 목록 페이지로 이동
            })
            .catch((err) => {
                console.error("게시판 수정 중 오류가 발생했습니다.", err);
                setError("게시판 수정 중 문제가 발생했습니다. 다시 시도해주세요.");
            })
            .finally(() => {
                setLoading(false); // 로딩 상태 종료
            });
    };

    return (
        <div className="edu-edit-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>게시판 수정</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                // disabled // 제목 필드를 비활성화
                                required
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                                label="작성자"
                                fullWidth
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                                label="내용"
                                fullWidth
                                multiline
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>썸네일 이미지:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailFileChange}
                            />
                            {thumbnailPreview && (
                                <div>
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                                    />
                                </div>
                            )}
                            {existingThumbnail && !thumbnailFile && (
                                <div>
                                    <img
                                        src={existingThumbnail}
                                        alt="Existing Thumbnail"
                                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>영상 파일:</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoFileChange}
                            />
                        </div>

                        <div className="button-group">
                            <Button
                                variant="outlined"
                                color="success"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "수정 중..." : "수정"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/eduData/video-education")}
                                className="me-2"
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

export default VideoEducationEdit;
