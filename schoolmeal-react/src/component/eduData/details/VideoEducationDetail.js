import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduDetail.css";
import { RiVideoDownloadFill } from "react-icons/ri";
import { FaVideoSlash } from "react-icons/fa";

function VideoEducationDetail() {
    const { id } = useParams();  // URL에서 id 값을 받아옴
    const [videoEducation, setVideoEducation] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 ID입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`${SERVER_URL}videoEducation/${id}`) // API URL
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
        return <div>데이터를 로딩 중...</div>;
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

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;
    
        axios
            .delete(`${SERVER_URL}videoEducation/delete/${id}`) // 수정된 URL로 요청
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

    const imageUrl = videoEducation.imageUrl; // 서버에서 받은 imageUrl

    const fullImageUrl = imageUrl.startsWith('/videoEducation/images') 
        ? `http://localhost:8090${imageUrl}` 
        : imageUrl;  // 시작하지 않으면 그냥 그대로 사용

    console.log(fullImageUrl);  // 확인용 로그

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
                        {videoEducation.videoUrl ? (
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

                        {/* 이미지가 있으면 이미지 표시 */}
                        {imageUrl && (
                            <div className="edu-form-group">
                                <label></label>
                                <img
                                    src={fullImageUrl}
                                    alt="교육자료 이미지"
                                    className="edu-thumbnail-container"
                                />
                            </div>
                        )}

                        <div className="edu-button-group">
                            <Button variant="outlined" color="success" onClick={update}>
                                수정
                            </Button>
                            <Button variant="outlined" color="primary" onClick={() => navigate("/eduData/video-education")}>
                                목록
                            </Button>
                            <Button variant="contained" color="error" onClick={deleteForm}>
                                삭제
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VideoEducationDetail;
