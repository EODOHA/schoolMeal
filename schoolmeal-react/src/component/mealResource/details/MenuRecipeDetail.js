import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealDetail.css"; // 스타일시트 적용
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileUnknowFill } from "react-icons/ri";

function MenuRecipeDetail() {
    const { id } = useParams(); // URL에서 id 값을 받아옴
    const [menuRecipe, setMenuRecipe] = useState(null);
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
            .get(`${SERVER_URL}menuRecipes/${id}`)
            .then((response) => {
                setMenuRecipe(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("데이터를 가져오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>데이터 로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!menuRecipe) {
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
        navigate(`/mealResource/menu-recipe/update/${id}`); // 수정 페이지로 이동
    };

    const deleteForm = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios
            .delete(`${SERVER_URL}menuRecipes/${id}`)
            .then((response) => {
                if (response.status === 200) { // 상태 코드 확인
                    window.alert("삭제 성공");
                    navigate("/mealResource/menu-recipe"); // 목록으로 돌아가기
                } else {
                    window.alert("삭제 실패");
                }
            })
            .catch((err) => {
                window.alert("삭제 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="meal-resource-detail-container">
            <div className="meal-resource-card">
                <div className="meal-resource-card-body">
                    <h2>{menuRecipe.title}</h2>
                    <hr />
                    <div className="meal-resource-header">
                        <div className="meal-resource-id">ID: {menuRecipe.id}</div>
                        <div className="meal-resource-date">작성일: {formatDate(menuRecipe.createdDate)}</div>
                    </div>
                    <div className="meal-resource-attachment">
                        {menuRecipe.fileId ? (
                            <a
                                href={`${SERVER_URL}menuRecipe/download/${menuRecipe.fileId}`}
                                download
                                className="meal-resource-attachment-link"
                            >
                                첨부파일 &nbsp; <MdOutlineFileDownload />
                            </a>
                        ) : (
                            <span>첨부파일 없음 &nbsp; <RiFileUnknowFill /></span>
                        )}
                    </div><br />
                    <form>
                        <div className="meal-resource-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                value={menuRecipe.writer}
                                readOnly
                                className="meal-resource-form-control"
                            />
                        </div><br />
                        <div className="meal-resource-form-group">
                            <label>내용:</label>
                            <textarea
                                rows={5}
                                value={menuRecipe.content}
                                readOnly
                                className="meal-resource-form-control"
                            />
                        </div><br />

                        <div className="meal-resource-button-group">
                            <Button
                                variant="outlined"
                                color="success"
                                onClick={update}
                            >
                                수정
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/mealResource/menu-recipe")}
                            >
                                목록
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={deleteForm}
                            >
                                삭제
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MenuRecipeDetail;
