import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealWrite.css"; // 스타일시트 적용

function MealPolicyOperationWrite() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null); // 파일 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate();

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

        // 파일이 있을 때만 formData에 파일 추가
        if (file) {
            formData.append("file", file);
        }

        // POST 요청
        axios
            .post(`${SERVER_URL}mealPolicyOperation/writepro`, formData, {
                headers: {
                    // 'Content-Type'은 Axios가 자동으로 처리함
                },
            })
            .then((response) => {
                window.alert("게시글이 성공적으로 등록되었습니다.");
                navigate("/mealResource/meal-policy-operation"); // 성공 시 목록 페이지로 이동
            })
            .catch((err) => {
                console.error("게시판 등록 중 오류가 발생했습니다.", err);
                setError("게시판 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
            })
            .finally(() => {
                setLoading(false); // 로딩 상태 종료
            });
    };

    return (
        <div className="meal-write-container">
            <div className="meal-write-card">
                <div className="meal-write-card-body">
                    <h2>새 게시판 작성</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                                label="작성자"
                                fullWidth
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <TextField
                                label="내용"
                                fullWidth
                                multiline
                                rows={5}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>첨부파일:</label>
                            <input
                                type="file"
                                accept="image/*, .pdf, .docx"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="button-group">
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
                                onClick={() => navigate("/mealResource/meal-policy-operation")}
                                className="me-2"
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

export default MealPolicyOperationWrite;
