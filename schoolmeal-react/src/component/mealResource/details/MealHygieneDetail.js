import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealDetail.css"; // 스타일시트 적용
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileUnknowFill } from "react-icons/ri";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function MealHygieneDetail() {
    const { id } = useParams(); // URL에서 id 값을 받아옴
    const [mealHygiene, setMealHygiene] = useState(null);
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
            .get(`${SERVER_URL}mealHygiene/${id}`)
            .then((response) => {
                setMealHygiene(response.data);
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

    if (!mealHygiene) {
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
        navigate(`/mealResource/meal-hygiene/update/${id}`); // 수정 페이지로 이동
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}mealHygiene/delete/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    window.alert("삭제 성공");
                    navigate("/mealResource/meal-hygiene");
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
        <div className="meal-resource-detail-container">
            <div className="meal-resource-card">
                <div className="meal-resource-card-body">
                    <h2>{mealHygiene.title}</h2>
                    <hr />
                    <div className="meal-resource-header">
                        <div className="meal-resource-id">ID: {mealHygiene.id}</div>
                        <div className="meal-resource-date">작성일: {formatDate(mealHygiene.createdDate)}</div>
                    </div>
                    <div className="meal-resource-attachment">
                        {/* 파일 URL을 사용하여 다운로드 링크를 생성 */}
                        <div className="meal-resource-attachment">
                            {mealHygiene.fileUrlId ? (
                                <a
                                    href={`${SERVER_URL}mealHygiene/download/${mealHygiene.id}`} // id를 사용하여 다운로드 URL 완성
                                    download
                                    className="meal-resource-attachment-link"
                                >
                                    첨부파일 &nbsp; <MdOutlineFileDownload />
                                </a>
                            ) : (
                                <span>첨부파일 없음 &nbsp; <RiFileUnknowFill /></span>
                            )}
                        </div>
                    </div><br />
                    <form>
                        <div className="meal-resource-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                value={mealHygiene.writer}
                                readOnly
                                className="meal-resource-form-control"
                            />
                        </div><br />
                        <div className="meal-resource-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={5}
                                value={mealHygiene.content}
                                readOnly
                                className="meal-resource-form-control"
                            />
                        </div>
                        <br />
                        <div className="meal-resource-button-group">
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
                                onClick={() => navigate("/mealResource/meal-hygiene")}
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

export default MealHygieneDetail;
