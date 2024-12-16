import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/eduData/EduWrite.css";
import LoadingSpinner from '../../common/LoadingSpinner';

function NutritionDietEducationWrite() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null); // 파일 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const navigate = useNavigate();

    // AuthContext에서 인증 상태와 권한 정보 가져오기
    const { isAuth, isAdmin, token } = useAuth();

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

    // 로그인하지 않았거나 관리자가 아닌 경우에는 화면 렌더링을 하지 않음
    if (isLoadingAuth || !isAuth || !isAdmin) {
        return <div><LoadingSpinner /></div>;
    }

    // 파일 입력 변경 핸들러
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);

        if (file) {
            formData.append("file", file);
        }

        axios.post(`${SERVER_URL}nutritionDietEducation/writepro`, formData, {
            headers: {
                Authorization: `${token}`,
            },
        })
            .then((response) => {
                window.alert("게시글이 성공적으로 등록되었습니다.");
                navigate("/eduData/nutrition-diet-education");
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
        <div className="edu-write-container">
            <div className="edu-card">
                <div className="edu-card-body">
                    <h2>새 게시글 작성</h2>
                    {error && <div className="edu-error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="edu-form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="edu-form-group">
                            <TextField
                                label="작성자"
                                fullWidth
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
                                required
                            />
                        </div>

                        <div className="edu-form-group">
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

                        <div className="edu-form-group">
                            <label>첨부파일:</label>
                            <input
                                type="file"
                                accept="image/*, .pdf, .docx"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="edu-button-group">
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
                                onClick={() => navigate("/eduData/nutrition-diet-education")}
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

export default NutritionDietEducationWrite;
