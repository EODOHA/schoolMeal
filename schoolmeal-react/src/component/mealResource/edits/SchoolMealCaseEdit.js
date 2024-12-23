import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealEdit.css";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';

function SchoolMealCaseEdit() {
    const [schoolMealCase, setSchoolMealCase] = useState({
        title: "",
        writer: "",
        createdDate: "",
        content: "",
        fileId: null,
        file: null,
        fileUrl: null,
        image: null,
        imagePreview: null,
        imageUrlId: null,
        imageUrl: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuth, isAdmin, isBoardAdmin, token } = useAuth(); // 인증 상태와 권한 여부 가져오기
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const { id } = useParams();
    const navigate = useNavigate();
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // Max file size 10MB

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

    useEffect(() => {
        axios
            .get(`${SERVER_URL}schoolMealCase/${id}`, {
            })
            .then((response) => {
                const data = response.data;
                setSchoolMealCase({
                    title: data.title,
                    writer: data.writer,
                    createdDate: data.createdDate,
                    content: data.content,
                    fileId: data.fileId || null,
                    file: null,
                    fileUrl: data.fileUrl || null,
                    imageUrlId: data.imageUrlId || null,
                    imageUrl: data.imageUrl || null,
                    image: null,
                    imagePreview: data.imageUrl || null, // 기본 이미지 URL 설정
                });

                // imageUrlId가 있을 때 이미지를 가져오는 부분
                // 이미지 URL이 갱신되었으므로, imageUrlId를 이용해 이미지를 가져옵니다.
                if (data.imageUrlId) {
                    axios.get(`${SERVER_URL}schoolMealCase/image/${data.imageUrlId}`)
                        .then(response => {
                            const imageUrl = response.data.imageUrl;
                            setSchoolMealCase((prevState) => ({
                                ...prevState,
                                imagePreview: imageUrl,  // 갱신된 image_url을 상태에 반영
                            }));
                        })
                        .catch(error => {
                            console.error("Error fetching image:", error);
                        });
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching post:", err);
                setError("게시글을 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [id, token]);

    const handleChange = (e) => {
        const { name, files } = e.target;
        const file = files ? files[0] : null;

        if (name === "file") {
            if (file && file.size > MAX_FILE_SIZE) {
                alert("파일 크기가 너무 큽니다. 최대 10MB까지 지원됩니다.");
                return;
            }
            setSchoolMealCase({
                ...schoolMealCase,
                file,
            });
        } else if (name === "image") {
            if (file && file.size > MAX_FILE_SIZE) {
                alert("이미지 크기가 너무 큽니다. 최대 10MB까지 지원됩니다.");
                return;
            }

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSchoolMealCase({
                        ...schoolMealCase,
                        image: file,
                        imagePreview: reader.result, // 새 이미지 미리보기
                    });
                };
                reader.readAsDataURL(file);
            } else {
                setSchoolMealCase({
                    ...schoolMealCase,
                    image: null,
                    imagePreview: null,
                });
            }
        } else {
            setSchoolMealCase({
                ...schoolMealCase,
                [name]: e.target.value,
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", schoolMealCase.title);
        formData.append("writer", schoolMealCase.writer);
        formData.append("content", schoolMealCase.content);

        if (schoolMealCase.file) {
            formData.append("file", schoolMealCase.file);
        } else if (schoolMealCase.fileId) {
            formData.append("fileId", schoolMealCase.fileId);
        }

        if (schoolMealCase.image) {
            formData.append("image", schoolMealCase.image);
        }

        // Axios 요청 보내기
        try {
            const response = await axios.put(`${SERVER_URL}schoolMealCase/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",  // 이 부분이 매우 중요!
                },
            });
            if (response.status === 200) {
                alert("수정되었습니다.");
                navigate("/mealResource/school-meal-case");
            } else {
                throw new Error("Unexpected response status");
            }
        } catch (err) {
            console.error("Error updating post:", err);
            setError("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    if (isLoadingAuth || loading) {
        return <LoadingSpinner />;
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
                            <label>제목:</label>
                            <input
                                type="text"
                                name="title"
                                value={schoolMealCase.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                name="writer"
                                value={schoolMealCase.writer}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>내용:</label>
                            <textarea
                                name="content"
                                rows={1}
                                value={schoolMealCase.content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>첨부파일</label>
                            <input
                                type="file"
                                name="file"
                                accept=".pdf, .docx, .xlsx, .hwp"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>이미지</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            {schoolMealCase.imagePreview ? (
                                <div className="meal-resource-image-preview-container">
                                    <img
                                        src={schoolMealCase.imagePreview} // imagePreview로 이미지 경로 설정
                                        alt="이미지 미리보기"
                                        className="meal-resource-image-preview"
                                    />
                                </div>
                            ) : schoolMealCase.imageUrlId ? (
                                <div className="meal-resource-image-preview-container">
                                    <img
                                        src={`${SERVER_URL}schoolMealCase/image/${schoolMealCase.imageUrlId}`} // 서버에서 이미지 URL을 동적으로 불러오기
                                        alt="기존 이미지"
                                        className="meal-resource-image-preview"
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="meal-resource-button-group">
                            <Button variant="contained" color="success" type="submit">
                                수정 저장
                            </Button>
                            <Button variant="outlined" onClick={() => navigate(`/mealResource/school-meal-case`)} >
                                취소
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SchoolMealCaseEdit;
