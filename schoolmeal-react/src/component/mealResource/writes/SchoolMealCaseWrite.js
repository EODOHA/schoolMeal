import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/mealResource/MealWrite.css";
import LoadingSpinner from '../../common/LoadingSpinner';

function SchoolMealCaseWrite() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null); // 일반 파일 상태
    const [image, setImage] = useState(null); // 이미지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태
    const navigate = useNavigate();

    // AuthContext에서 인증 상태와 권한 정보 가져오기
    const { isAuth, isAdmin, isBoardAdmin, token, role, memberId } = useAuth();

    // 작성자를 memberId로 설정
    useEffect(() => {
        let writer = role;
        if (isAdmin) {
            writer = "관리자";
        } else if (isBoardAdmin) {
            writer = "담당자";
        }
        setWriter(writer);
    }, [memberId, role, isAdmin, isBoardAdmin]);

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

    if (isLoadingAuth || !isAuth || (isAdmin === false && isBoardAdmin === false)) {
        return <div><LoadingSpinner /></div>;
    }

    // 파일 입력 변경 핸들러
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 이미지 입력 변경 핸들러
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);

        // 이미지 미리보기 설정
        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 미리보기 이미지 설정
            };
            reader.readAsDataURL(selectedImage); // 파일을 데이터 URL로 읽음
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!image) {
            alert("이미지를 업로드해 주세요.");
            setLoading(false); // 로딩 상태를 종료
            return; // 폼 제출을 중단
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);

        if (file) {
            formData.append("file", file); // 일반 파일 추가
        }

        if (image) {
            formData.append("image", image); // 이미지 파일 추가
        }

        axios.post(`${SERVER_URL}schoolMealCase/writepro`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                // console.log("응답 데이터: ", response.data);  // 응답 전체 로그 출력
                const { fileUrl, imageUrl } = response.data;  // 서버 응답에서 fileUrl과 imageUrl 추출

                // 응답에 fileUrl과 imageUrl이 존재하는지 체크
                if (fileUrl && imageUrl) {
                    window.alert("게시글이 성공적으로 등록되었습니다.");
                    navigate("/mealResource/school-meal-case");
                } else {
                    window.alert("파일 또는 이미지 URL이 잘못 반환되었습니다.");
                }
            })
            .catch((err) => {
                console.error("게시글 등록 중 오류가 발생했습니다.", err);
                setError("게시글 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="meal-resource-write-container">
            <div className="meal-resource-card">
                <div className="meal-resource-card-body">
                    <h2>새 게시글 작성</h2>
                    {error && <div className="meal-resource-error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="meal-resource-form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <TextField
                                label="작성자"
                                fullWidth
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <TextField
                                label="내용"
                                fullWidth
                                multiline
                                rows={1}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                        <div className="meal-resource-form-group">
                            <label>첨부파일:</label>
                            <input
                                type="file"
                                accept=".pdf, .docx, .xlsx, .hwp"
                                onChange={handleFileChange}
                            />
                        </div>
                        {/* 이미지 미리보기 추가 */}
                        <div className="meal-resource-form-group">
                            <label>이미지(필수):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className="meal-resource-image-preview-container">
                                    <img src={imagePreview} alt="미리보기" className="meal-resource-image-preview" />
                                </div>
                            )}
                        </div>
                        <div className="meal-resource-button-group">
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "등록 중..." : "등록"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/mealResource/school-meal-case")}
                            >
                                목록
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SchoolMealCaseWrite;
