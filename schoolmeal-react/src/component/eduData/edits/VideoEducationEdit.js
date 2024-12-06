import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduEdit.css";

function VideoEducationEdit() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [videoFile, setVideoFile] = useState(null); // 새로 선택한 파일
    const [existingVideo, setExistingVideo] = useState(""); // 기존 비디오 URL
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null); // 미리보기 URL
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // 기존 데이터 로드
    useEffect(() => {
        axios
            .get(`${SERVER_URL}videoEducation/${id}`)
            .then((response) => {
                const data = response.data;
                setTitle(data.title);
                setWriter(data.writer);
                setContent(data.content);
                if (data.fileUrl) {
                    setExistingVideo(`${SERVER_URL}videoEducation/videos/${data.fileId}`);
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
                `${SERVER_URL}videoEducation/update/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

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
                                            console.log("업로드된 파일:", file);
                                            console.log("생성된 URL:", tempUrl);
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
