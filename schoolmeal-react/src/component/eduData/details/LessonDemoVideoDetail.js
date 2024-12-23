import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduDetail.css";
import { RiVideoDownloadFill } from "react-icons/ri";
import { FaVideoSlash } from "react-icons/fa";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function LessonDemoVideoDetail() {
    const { id } = useParams();  // URL에서 id 값을 받아옴
    const [lessonDemoVideo, setLessonDemoVideo] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate();

    // 권한설정
    const { token, isAdmin, isBoardAdmin } = useAuth();
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 ID입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`${SERVER_URL}lessonDemoVideo/${id}`) // API URL
            .then((response) => {
                setLessonDemoVideo(response.data);
                // 작성자 확인
                const isAuthor = (isAdmin && response.data.writer === "관리자") ||
                    (isBoardAdmin && response.data.writer === "담당자");
                setIsAuthor(isAuthor);
                setLoading(false);
            })
            .catch((error) => {
                setError("데이터를 가져오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [id, isAdmin, isBoardAdmin]);

    if (loading) {
        return <div><LoadingSpinner /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!lessonDemoVideo) {
        return <div>데이터를 찾을 수 없습니다.</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return "유효하지 않은 날짜";
        }
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    const update = () => {
        navigate(`/eduData/lesson-demo-video/update/${id}`); // 수정 페이지로 이동
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}lessonDemoVideo/delete/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            }) // 수정된 URL로 요청
            .then((response) => {
                if (response.status === 200) {
                    window.alert("삭제 성공");
                    navigate("/eduData/lesson-demo-video"); // 목록으로 돌아가기
                } else {
                    window.alert("삭제 실패");
                }
            })
            .catch((err) => {
                window.alert("삭제 중 오류가 발생했습니다.");
            });
    };

    // 비디오 URL 처리
    const videoUrl = lessonDemoVideo?.id;  // lessonDemoVideo 객체에서 id 사용

    const fullVideoUrl = videoUrl
        ? `${SERVER_URL}lessonDemoVideo/video/${videoUrl}`  // lessonDemoVideo의 ID를 URL에 추가
        : null;

    return (
        <div className="edu-detail-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>{lessonDemoVideo.title}</h2>
                    <hr />
                    <div className="edu-header">
                        <div className="edu-id">ID: {lessonDemoVideo.id}</div>
                        <div className="edu-date">작성일: {formatDate(lessonDemoVideo.createdDate)}</div>
                    </div>
                    <div className="edu-attachment">
                        {lessonDemoVideo.fileUrlId ? (
                            <a
                                href={`${SERVER_URL}lessonDemoVideo/download/${lessonDemoVideo.id}`}
                                download
                                className="edu-attachment-link"
                            >
                                동영상 다운로드 &nbsp; <RiVideoDownloadFill />
                            </a>
                        ) : (
                            <span>동영상 없음 &nbsp;<FaVideoSlash /></span>
                        )}
                    </div><br />
                    <form>
                        <div className="edu-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                value={lessonDemoVideo.writer}
                                readOnly
                                className="edu-form-control"
                            />
                        </div>
                        <div className="edu-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={1}
                                value={lessonDemoVideo.content}
                                readOnly
                                className="edu-form-control"
                            />
                        </div>

                        {/* 영상 재생 (업로드된 비디오 파일이 있을 경우) */}
                        {lessonDemoVideo.fileUrlId && (
                            <div className="edu-video-play">
                                <h4>영상 재생:</h4>
                                <video
                                    controls
                                    src={fullVideoUrl} // 백엔드에서 제공하는 비디오 URL
                                >
                                    브라우저가 비디오 태그를 지원하지 않습니다.
                                </video>
                            </div>
                        )}
                        <br />
                        <div className="edu-button-group">
                            {isAuthor && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={update}
                                >
                                    수정
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="primary" onClick={() => navigate("/eduData/lesson-demo-video")}
                            >
                                목록
                            </Button>
                            {((isAdmin || (isBoardAdmin && isAuthor)) && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={deleteForm}
                                    disabled={!(isAdmin || (isBoardAdmin && isAuthor))}
                                >
                                    삭제
                                </Button>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LessonDemoVideoDetail;
