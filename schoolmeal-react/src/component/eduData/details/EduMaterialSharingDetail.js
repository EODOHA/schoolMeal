import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduDetail.css"; // 스타일시트 적용
import { MdOutlineFileDownload } from "react-icons/md";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function EeduMaterialSharingDetail() {
    const { id } = useParams(); // URL에서 id 값을 받아옴
    const [eduMaterialSharing, setEeduMaterialSharing] = useState(null);
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
            .get(`${SERVER_URL}eduMaterialSharing/${id}`)
            .then((response) => {
                setEeduMaterialSharing(response.data);
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

    if (!eduMaterialSharing) {
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
        navigate(`/eduData/edu-material-sharing/update/${id}`); // 수정 페이지로 이동
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}eduMaterialSharing/delete/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    window.alert("삭제 성공");
                    navigate("/eduData/edu-material-sharing");
                } else {
                    window.alert("삭제 실패");
                }
            })
            .catch((err) => {
                console.error("Delete error:", err);
                window.alert("삭제 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="edu-detail-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>{eduMaterialSharing.title}</h2>
                    <hr />
                    <div className="edu-header">
                        <div className="edu-id">ID: {eduMaterialSharing.id}</div>
                        <div className="edu-date">작성일: {formatDate(eduMaterialSharing.createdDate)}</div>
                    </div>
                    <div className="edu-attachment">
                        {/* 이미지 다운로드 버튼 추가 */}
                        {eduMaterialSharing.imageUrlId ? (
                            <div className="edu-attachment">
                                <a
                                    href={`${SERVER_URL}eduMaterialSharing/download/image/${eduMaterialSharing.id}`} // 이미지 다운로드 URL
                                    download
                                    className="edu-attachment-link"
                                >
                                    이미지 다운로드 &nbsp; <MdOutlineFileDownload />
                                </a>
                            </div>
                        ) : (
                            <span></span>
                        )}
                        {/* 첨부파일 다운로드 버튼 */}
                        {eduMaterialSharing.fileUrlId ? (
                            <div className="edu-attachment">
                                <a
                                    href={`${SERVER_URL}eduMaterialSharing/download/file/${eduMaterialSharing.id}`} // 파일 다운로드 URL 완성
                                    download
                                    className="edu-attachment-link"
                                >
                                    첨부파일 &nbsp; <MdOutlineFileDownload />
                                </a>
                            </div>
                        ) : (
                            <span></span>
                        )}
                    </div>
                    <form>
                        <div className="edu-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                value={eduMaterialSharing.writer}
                                readOnly
                                className="edu-form-control"
                            />
                        </div><br />
                        <div className="edu-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={1}
                                value={eduMaterialSharing.content}
                                readOnly
                                className="edu-form-control"
                            />
                        </div>
                        {/* 이미지가 있으면 이미지 표시 */}
                        {eduMaterialSharing.imageUrl && (
                            <div className="edu-image">
                                <img
                                    src={`${SERVER_URL}eduMaterialSharing/download/image/${eduMaterialSharing.id}`} // 이미지 다운로드 경로 수정
                                    alt="이미지"
                                />
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
                                color="primary"
                                onClick={() => navigate("/eduData/edu-material-sharing")}
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

export default EeduMaterialSharingDetail;
