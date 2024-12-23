import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import "../../../css/eduData/EduEdit.css";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function NutritionDietEducationEdit() {
    const [nutritionDietEducation, setNutritionDietEducation] = useState({
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
    const { isAuth, isAdmin, isBoardAdmin, token } = useAuth(); // 인증 상태와 권한 여부 가져오기
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    useEffect(() => {
        // 인증 상태와 권한 정보가 변경될 때마다 실행
        if (isAuth !== undefined && isAdmin !== undefined && isBoardAdmin !== undefined) {
            setIsLoadingAuth(false); // 인증 상태가 로드된 후 로딩 상태를 false로 설정
        }
    }, [isAuth, isAdmin, isBoardAdmin]);

    useEffect(() => {
        // 인증 상태가 완전히 로딩된 후, 권한이 없을 경우 "unauthorized" 페이지로 리다이렉트
        if (!isLoadingAuth && (!isAuth || (!isAdmin && !isBoardAdmin))) {
            navigate("/unauthorized");
        }
    }, [isAuth, isAdmin, isBoardAdmin, isLoadingAuth, navigate]);

    // 데이터를 불러오는 useEffect
    useEffect(() => {
        if (isAuth && isAdmin) {
            axios
                .get(`${SERVER_URL}nutritionDietEducation/${id}`)
                .then((response) => {
                    const data = response.data;
                    setNutritionDietEducation({
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
            }
            setNutritionDietEducation({
                ...nutritionDietEducation,
                file: file || null,
            });
        } else {
            setNutritionDietEducation({
                ...nutritionDietEducation,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", nutritionDietEducation.title);
        formData.append("writer", nutritionDietEducation.writer);
        formData.append("content", nutritionDietEducation.content);

        if (nutritionDietEducation.file) {
            formData.append("file", nutritionDietEducation.file);
        } else if (nutritionDietEducation.fileId) {
            formData.append("fileId", nutritionDietEducation.fileId);
        }

        try {
            await axios.put(`${SERVER_URL}nutritionDietEducation/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("수정되었습니다.");
            navigate("/eduData/nutrition-diet-education");
        } catch (err) {
            console.error("Error updating post:", err);
            setError("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingAuth || loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="edu-error-message">{error}</div>;
    }

    return (
        <div className="edu-edit-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>게시글 수정</h2>
                    <form onSubmit={handleSave}>
                        <div className="edu-form-group">
                            <label>제목:</label>
                            <input
                                type="text"
                                name="title"
                                value={nutritionDietEducation.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="edu-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                name="writer"
                                value={nutritionDietEducation.writer}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="edu-form-group">
                            <label>내용:</label>
                            <textarea
                                name="content"
                                rows={1}
                                value={nutritionDietEducation.content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="edu-form-group">
                            <label>첨부파일</label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*, .pdf, .docx, .xlsx, .hwp"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edu-button-group">
                            <Button variant="contained" color="success" type="submit">
                                수정 저장
                            </Button>
                            <Button variant="outlined" onClick={() => navigate(`/eduData/nutrition-diet-education/${id}`)}>
                                취소
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NutritionDietEducationEdit;
