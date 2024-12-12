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

function VideoEducationDetail() {
    const { id } = useParams();  // URL에서 id 값을 받아옴
    const [videoEducation, setVideoEducation] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const { isAdmin } = useAuth();  // 로그인 상태 확인
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 ID입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`${SERVER_URL}videoEducations/${id}`) // API URL
            .then((response) => {
                setVideoEducation(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("데이터를 가져오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div><LoadingSpinner /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!videoEducation) {
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
        navigate(`/eduData/video-education/update/${id}`); // 수정 페이지로 이동
    };

    const token = sessionStorage.getItem('jwt'); // JWT 토큰 가져오기
    console.log(token);

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}videoEducations/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            }) // 수정된 URL로 요청
            .then((response) => {
                if (response.status === 200) {
                    window.alert("삭제 성공");
                    navigate("/eduData/video-education"); // 목록으로 돌아가기
                } else {
                    window.alert("삭제 실패");
                }
            })
            .catch((err) => {
                window.alert("삭제 중 오류가 발생했습니다.");
            });
    };

    // 비디오 URL 처리
    const videoUrl = videoEducation?.id;  // videoEducation 객체에서 id 사용

    const fullVideoUrl = videoUrl
        ? `${SERVER_URL}videoEducation/video/${videoUrl}`  // videoEducation의 ID를 URL에 추가
        : null;

    console.log("비디오 URL:", fullVideoUrl);  // 전체 비디오 URL 확인



    return (
        <div className="edu-detail-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>{videoEducation.title}</h2>
                    <hr />
                    <div className="edu-header">
                        <div className="edu-id">ID: {videoEducation.id}</div>
                        <div className="edu-date">작성일: {formatDate(videoEducation.createdDate)}</div>
                    </div>
                    <div className="edu-attachment">
                        {videoEducation?._links?.fileUrl?.href ? (
                            <a
                                href={`${SERVER_URL}videoEducation/download/${videoEducation.id}`}
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
                                value={videoEducation.writer}
                                readOnly
                                className="edu-form-control"
                            />
                        </div>
                        <div className="edu-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={5}
                                value={videoEducation.content}
                                readOnly
                                className="edu-form-control"
                            />
                        </div>

                        {/* 영상 재생 (업로드된 비디오 파일이 있을 경우) */}
                        {fullVideoUrl && (
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

                        <div className="edu-button-group">
                            {isAdmin && (
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
                                color="primary" onClick={() => navigate("/eduData/video-education")}
                            >
                                목록
                            </Button>
                            {isAdmin && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={deleteForm}
                                >
                                    삭제
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VideoEducationDetail;
