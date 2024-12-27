import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileUnknowFill } from "react-icons/ri";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';
import "../../../css/community/NoticeDetail.css";

function NoticeDetail() {
    const { id } = useParams(); // URL에서 id 값을 받아옴
    const [notice, setNotice] = useState(null);
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
            .get(`${SERVER_URL}notices/${id}`)
            .then((response) => {
                setNotice(response.data);
                // 작성자 확인
                const isAuthor = (isAdmin && response.data.writer === "관리자") ||
                    (isBoardAdmin && response.data.writer === "담당자");
                setIsAuthor(isAuthor);
                setLoading(false);
            })
            .catch((err) => {
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

    if (!notice) {
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
        navigate(`/community/notices/update/${id}`); // 수정 페이지로 이동
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}notices/delete/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    window.alert("삭제 성공");
                    navigate("/community/notices");
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
        <div className="notice-detail-container">
            <div className="notice-card">
                <div className="notice-card-body">
                    <h2>{notice.title}</h2>
                    <hr />
                    <div className="notice-header">
                        <div className="notice-id">ID: {notice.id}</div>
                        <div className="notice-date">작성일: {formatDate(notice.createdDate)}</div>
                    </div>
                    <div className="notice-attachment">
                        {/* 파일 URL을 사용하여 다운로드 링크를 생성 */}
                        <div className="notice-attachment">
                            {notice.fileUrlId ? (
                                <a
                                    href={`${SERVER_URL}notice/download/${notice.id}`} // id를 사용하여 다운로드 URL 완성
                                    download
                                    className="notice-attachment-link"
                                >
                                    첨부파일 &nbsp; <MdOutlineFileDownload />
                                </a>
                            ) : (
                                <span>첨부파일 없음 &nbsp; <RiFileUnknowFill /></span>
                            )}
                        </div>
                    </div><br />
                    <form>
                        <div className="notice-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                value={notice.writer}
                                readOnly
                                className="notice-form-control"
                            />
                        </div><br />
                        <div className="notice-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={1}
                                value={notice.content}
                                readOnly
                                className="notice-form-control"
                            />
                        </div>
                        <br />
                        <div className="notice-button-group">
                            {/* 수정은 작성자 본인, 삭제는 관리자도 선택 가능 */}
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
                                onClick={() => navigate("/community/notices")}
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

export default NoticeDetail;
