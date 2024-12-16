import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduEdit.css";

import { useAuth } from "../../sign/AuthContext";

function VideoEducationEdit() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [videoFile, setVideoFile] = useState(null); // 새로 선택한 파일
    const [existingVideo, setExistingVideo] = useState(""); // 기존 비디오 URL
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null); // 미리보기 URL
    const { isAuth, isAdmin, token } = useAuth(); // 인증 상태와 권한 여부 가져오기
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // 인증 상태와 권한 정보가 변경될 때마다 실행
        if (isAuth !== undefined && isAdmin !== undefined) {
            setIsLoadingAuth(false); // 인증 상태가 로드된 후 로딩 상태를 false로 설정
        }
    }, [isAuth, isAdmin]);

    useEffect(() => {
        // `isAuth`와 `isAdmin` 값이 `false`로 설정된 이후에만 실행되도록 체크
        if (!isLoadingAuth && (isAuth === false || isAdmin === false)) {
            navigate("/unauthorized");
        }
    }, [isAuth, isAdmin, navigate, isLoadingAuth]);

    // 기존 데이터 로드
    useEffect(() => {
        axios
            .get(`${SERVER_URL}videoEducation/${id}`)
            .then((response) => {
                const data = response.data;
                setTitle(data.title);
                setWriter(data.writer);
                setContent(data.content);
                // 기존 비디오 URL을 http://localhost:8090/videoEducation/video/{id}로 설정
                if (data.id) {
                    setExistingVideo(`${SERVER_URL}videoEducation/video/${data.id}`);
                }
            })
            .catch((err) => {
                console.error("데이터 로드 실패:", err);
                setError("데이터를 불러오는 중 문제가 발생했습니다.");
            });
    }, [id]);

    // 새로 선택된 파일의 미리보기 URL 생성
    useEffect(() => {
        if (videoFile) {
            const tempUrl = URL.createObjectURL(videoFile);
            setPreviewVideoUrl(tempUrl);
            return () => URL.revokeObjectURL(tempUrl); // 메모리 해제
        }
        setPreviewVideoUrl(null);
    }, [videoFile]);

    const handleUpdateVideo = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);
        if (videoFile) formData.append("file", videoFile);

        try {
            setLoading(true);
            const response = await axios.put(
                `${SERVER_URL}videoEducation/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("게시글이 성공적으로 수정되었습니다.");
                navigate("/eduData/video-education");
            }
        } catch (err) {
            console.error("수정 실패:", err);
            setError("게시글 수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateVideo();
    };

    return (
        <div className="edu-edit-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>게시글 수정</h2>
                    {error && <div className="edu-error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="제목"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            label="작성자"
                            fullWidth
                            value={writer}
                            onChange={(e) => setWriter(e.target.value)}
                            required
                        />
                        <TextField
                            label="내용"
                            fullWidth
                            multiline
                            rows={1}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <div className="edu-form-group">
                            <label>영상 파일:</label>
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const tempUrl = URL.createObjectURL(file);
                                            setVideoFile(file);
                                            setPreviewVideoUrl(tempUrl); // URL 갱신
                                        }
                                    }}
                                />
                                <div className="edu-video-preview">
                                    {previewVideoUrl ? (
                                        <>
                                            <h4>새 영상 미리보기:</h4>
                                            <video controls src={previewVideoUrl}>
                                                브라우저가 비디오 태그를 지원하지 않습니다.
                                            </video>
                                        </>
                                    ) : existingVideo ? (
                                        <>
                                            <h4>기존 영상:</h4>
                                            <video controls src={existingVideo}>
                                                브라우저가 비디오 태그를 지원하지 않습니다.
                                            </video>
                                        </>
                                    ) : (
                                        <p>업로드된 영상이 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="edu-button-group">
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
