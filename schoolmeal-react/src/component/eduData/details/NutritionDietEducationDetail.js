import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduDetail.css"; // 스타일시트 적용
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileUnknowFill } from "react-icons/ri";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function NutritionDietEducationDetail() {
    const { id } = useParams(); // URL에서 id 값을 받아옴
    const [nutritionDietEducation, setNutritionDietEducation] = useState(null);
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
            .get(`${SERVER_URL}nutritionDietEducation/${id}`)
            .then((response) => {
                setNutritionDietEducation(response.data);
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

    if (!nutritionDietEducation) {
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
        navigate(`/eduData/nutrition-diet-education/update/${id}`); // 수정 페이지로 이동
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}nutritionDietEducation/delete/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    window.alert("삭제 성공");
                    navigate("/eduData/nutrition-diet-education");
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
                    <h2>{nutritionDietEducation.title}</h2>
                    <hr />
                    <div className="edu-header">
                        <div className="edu-id">ID: {nutritionDietEducation.id}</div>
                        <div className="edu-date">작성일: {formatDate(nutritionDietEducation.createdDate)}</div>
                    </div>
                    <div className="edu-attachment">
                        {/* 파일 URL을 사용하여 다운로드 링크를 생성 */}
                        <div className="edu-attachment">
                            {nutritionDietEducation.fileUrlId ? (
                                <a
                                    href={`${SERVER_URL}nutritionDietEducation/download/${nutritionDietEducation.id}`} // id를 사용하여 다운로드 URL 완성
                                    download
                                    className="edu-attachment-link"
                                >
                                    첨부파일 &nbsp; <MdOutlineFileDownload />
                                </a>
                            ) : (
                                <span>첨부파일 없음 &nbsp; <RiFileUnknowFill /></span>
                            )}
                        </div>
                    </div><br />
                    <form>
                        <div className="edu-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                value={nutritionDietEducation.writer}
                                readOnly
                                className="edu-form-control"
                            />
                        </div><br />
                        <div className="edu-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={1}
                                value={nutritionDietEducation.content}
                                readOnly
                                className="edu-form-control"
                            />
                        </div>
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
                                onClick={() => navigate("/eduData/nutrition-diet-education")}
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

export default NutritionDietEducationDetail;
