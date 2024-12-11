import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../../Constants";
import "../../../../css/mainManage/AdminNoticeManagerDetail.css"; // 스타일시트 적용
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileUnknowFill } from "react-icons/ri";
import { useAuth } from "../../../sign/AuthContext"; // 인증 정보를 위한 import 추가

function AdminNoticeManagerDetail() {
    const { id } = useParams(); // URL에서 id 값을 받아옴
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate();
    const { token, isAdmin } = useAuth(); // useAuth 훅에서 토큰 가져오기
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0});

    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 ID입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`${SERVER_URL}adminNotice/${id}`, {
                headers: {
                    'Authorization': token, // Authorization 헤더에 토큰 추가
                }
            })
            .then((response) => {
                setNotice(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("데이터를 가져오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [id, token]); // token 추가

    if (loading) {
        return <div>데이터 로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!notice) {
        return <div>데이터를 찾을 수 없습니다.</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일\n${hours}시 ${minutes}분 ${seconds}초`;
    };

    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    // 파일 확장자에 맞춰, 썸네일을 반환하는 함수.
    const getThumbnail = (fileName) => {
        if (!fileName) {
            return <RiFileUnknowFill />; // 파일명이 없으면 기본 아이콘 표시
        }

        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
            return <img src={`${SERVER_URL}adminNotice/download/${notice.fileName}`} alt="첨부파일 미리보기" className="file-thumbnail" />;
        } else {
            return null; // 이미지 파일 아니면, 썸네일 반환 X.
        }
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}adminNotice/${id}`, {
                headers: {
                    'Authorization': token, // 헤더에 토큰 추가
                }
            })
            .then((response) => {
                if (response.status === 200) { // 상태 코드 확인
                    window.alert("삭제 성공");
                    navigate("/adminNoticeManager"); // 목록으로 돌아가기
                } else {
                    window.alert("삭제 실패");
                }
            })
            .catch((err) => {
                window.alert("삭제 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="admin-notice-detail-container" onMouseMove={handleMouseMove}>
            <div className="admin-notice-card">
                <div className="admin-notice-card-body">
                    <h2>{notice.title}</h2>
                    <hr />
                    <div className="admin-notice-header">
                        <div className="admin-notice-id">글번호: {notice.id}</div>
                        <div className="admin-notice-author">등록자: {notice.author}</div>
                        <div className="admin-notice-date">등록일: {formatDate(notice.createdDate)}</div>
                    </div>
                    <div className="admin-notice-attachment">
                        {notice.fileName ? (
                            <a
                                href={`${SERVER_URL}adminNotice/download/${notice.fileName}`}
                                download
                                className="admin-notice-attachment-link"
                                onMouseEnter={() => setIsPreviewVisible(true)}
                                onMouseLeave={() => setIsPreviewVisible(false)}
                            >
                                {notice.fileName} &nbsp; <MdOutlineFileDownload />
                            </a>
                        ) : (
                            <span>첨부파일 없음 &nbsp; <RiFileUnknowFill /></span>
                        )}
                        {/* 미리보기 표시 */}
                        {isPreviewVisible && (
                            <div
                                className="thumbnail-preview"
                                style={{
                                    top: `${mousePosition.y - 20}px`, // 마우스 y 좌표 기준
                                    left: `${mousePosition.x - 200}px`, // 마우스 x 좌표 기준
                                }}
                            >
                                {getThumbnail(notice.fileName)}
                            </div>
                        )}
                    </div><br />
                    <form>
                        <div className="admin-notice-form-group">
                            <label>공지사항 내용</label>
                            <textarea
                                rows={5}
                                value={notice.content}
                                readOnly
                                className="admin-notice-form-control"
                            />
                        </div><br />

                        {/* 이미지 미리보기 */}
                        {notice.fileName && ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(notice.fileName.split('.').pop().toLowerCase()) && (
                            <div className="admin-notice-image-preview">
                                <img
                                    src={`${SERVER_URL}adminNotice/download/${notice.fileName}`}
                                    alt="첨부 이미지 미리보기"
                                />
                            </div>
                        )}
                        <br />
                        
                        <div className="admin-notice-button-group">
                            {isAdmin && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() => navigate(`/adminNoticeManager/edit/${notice.id}`)}
                                >
                                    수정
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/adminNoticeManager")}
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

export default AdminNoticeManagerDetail;
