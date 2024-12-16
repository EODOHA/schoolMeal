import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealEdit.css";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function MenuRecipeEdit() {
    const [menuRecipe, setMenuRecipe] = useState({
        title: "",
        writer: "",
        createdDate: "",
        content: "",
        fileId: "",
        file: null,
        fileUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuth, isAdmin, token } = useAuth(); // 인증 상태와 권한 여부 가져오기
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    useEffect(() => {
        // 인증 상태와 권한 정보가 변경될 때마다 실행
        if (isAuth !== undefined && isAdmin !== undefined) {
            setIsLoadingAuth(false); // 인증 상태가 로드된 후 로딩 상태를 false로 설정
        }
    }, [isAuth, isAdmin]);

    useEffect(() => {
        // `isAuth`와 `isAdmin` 값이 `false`로 설정된 이후에만 실행되도록 체크
        if (!isLoadingAuth && (isAuth === false || isAdmin === false)) {
            navigate("/unauthorized");
        }
    }, [isAuth, isAdmin, navigate, isLoadingAuth]);

    // 데이터를 불러오는 useEffect
    useEffect(() => {
        if (isAuth && isAdmin) {
            axios
                .get(`${SERVER_URL}menuRecipes/${id}`, {
                    headers: {
                        Authorizatio: `${token}`,
                    }
                })
                .then((response) => {
                    const data = response.data;
                    setMenuRecipe({
                        title: data.title,
                        writer: data.writer,
                        createdDate: data.createdDate,
                        content: data.content,
                        fileId: data.fileId,
                        file: null,
                        fileUrl: data.fileUrl,
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching post:", err);
                    setError("게시글을 불러오는 중 오류가 발생했습니다.");
                    setLoading(false);
                });
        }
    }, [id, isAuth, isAdmin, token]);

    const handleChange = (e) => {
        if (e.target.name === "file") {
            const file = e.target.files[0];
            if (file) {
                if (file.size > MAX_FILE_SIZE) {
                    alert("파일 크기가 너무 큽니다. 최대 10MB까지 지원됩니다.");
                    return;
                }
                console.log("Selected file:", file.name);
            }
            setMenuRecipe({
                ...menuRecipe,
                file: file || null,
            });
        } else {
            setMenuRecipe({
                ...menuRecipe,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", menuRecipe.title);
        formData.append("writer", menuRecipe.writer);
        formData.append("content", menuRecipe.content);

        if (menuRecipe.file) {
            formData.append("file", menuRecipe.file);
        } else if (menuRecipe.fileId) {
            formData.append("fileId", menuRecipe.fileId);
        }
        try {
            await axios.put(`${SERVER_URL}menuRecipe/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("수정되었습니다.");
            navigate("/mealResource/menu-recipe");
        } catch (err) {
            console.error("Error updating:", err);
            alert("수정에 실패했습니다: " + err.message);
        }
    };

    if (loading) {
        return <div><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="meal-resource-error-message">{error}</div>;
    }

    return (
        <div className="meal-resource-edit-container">
            <div className="meal-resource-card">
                <div className="meal-resource-card-body">
                    <h2>게시글 수정</h2>
                    <form onSubmit={handleSave}>
                        <div className="meal-resource-form-group">
                            <label>제목</label>
                            <input
                                type="text"
                                name="title"
                                value={menuRecipe.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="meal-resource-form-group">
                            <label>작성자</label>
                            <input
                                type="text"
                                name="writer"
                                value={menuRecipe.writer}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>내용:</label>
                            <textarea
                                name="content"
                                rows={5}
                                value={menuRecipe.content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>첨부파일</label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*,application/pdf,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="meal-resource-button-group">
                            <Button variant="contained" color="success" type="submit">수정 저장</Button>
                            <Button variant="outlined" onClick={() => navigate(`/mealResource/menu-recipe/${id}`)}>취소</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MenuRecipeEdit;
