import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduList.css";
import Button from "@mui/material/Button";
import { TfiVideoClapper } from "react-icons/tfi";
import { BsFileExcel } from "react-icons/bs";

function VideoEducationList() {
    const [videoEducation, setVideoEducation] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    // 컴포넌트가 마운트되면 목록을 가져옴
    useEffect(() => {
        fetch(SERVER_URL + "videoEducations")
            .then(response => response.json())
            .then(data => {
                setVideoEducation(data._embedded.videoEducations);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 상세 페이지로 이동하는 함수
    const goToDetailPage = (videoEducation) => {
        const videoEducationId = videoEducation.id || (videoEducation._links?.self?.href ? extractIdFromHref(videoEducation._links.self.href) : null);
        if (!videoEducationId) {
            console.error("Invalid ID:", videoEducationId);
            return;
        }
        navigate(`/eduData/video-education/${videoEducationId}`);
    };

    // URL에서 ID를 추출하는 함수
    const extractIdFromHref = (href) => {
        const parts = href.split('/');
        return parts[parts.length - 1];
    };

    return (
        <div className="edu-list-container">
            <h1 className="title">영상 교육자료</h1>
            <div className="button-group">
                <Button variant="outlined" onClick={() => navigate("/eduData")}>
                    이전으로
                </Button>
                <Button variant="outlined" onClick={() => navigate("/eduData/video-education/write")} style={{ marginLeft: "auto" }}>
                    새 글 쓰기
                </Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>작성자</th>
                        <th>영상</th>
                    </tr>
                </thead>
                <tbody>
                    {videoEducation.length === 0 ? (
                        <tr>
                            <td colSpan="5">데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        videoEducation.map((videoEducation, index) => {
                            const isSelected = id && videoEducation.id && id === videoEducation.id.toString();
                            const videoUrl = SERVER_URL + videoEducation.videoUrl; // 상대 URL을 절대 URL로 변환

                            return (
                                <tr
                                    key={videoEducation.id || `videoEducation-${index}`}
                                    onClick={() => goToDetailPage(videoEducation)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#e0f7fa" : "white",
                                    }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{videoEducation.title}</td>
                                    <td>{formatDate(videoEducation.createdDate)}</td>
                                    <td>{videoEducation.writer}</td>
                                    <td>
                                        {videoUrl && videoUrl.trim() !== "" ? (
                                            <span className="attachment-icon"><TfiVideoClapper /></span>
                                        ) : (
                                            <span className="attachment-icon"><BsFileExcel /></span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default VideoEducationList;
