import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealWrite.css"; // 스타일시트 적용

function MenuRecipeWrite() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null); // 파일 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const [ageGroup, setAgeGroup] = useState(""); // 연령대 상태
    const [season, setSeason] = useState(""); // 시기별(계절) 상태 추가
    const navigate = useNavigate();

    // 파일 입력 변경 핸들러
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 연령대 선택 변경 핸들러
    const handleAgeGroupChange = (e) => {
        setAgeGroup(e.target.value);
    };

    // 시기별(계절) 선택 변경 핸들러
    const handleSeasonChange = (e) => {
        setSeason(e.target.value);
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);
        formData.append("ageGroup", ageGroup);
        formData.append("season", season); // 시기별 추가

        // 파일이 있을 때만 formData에 파일 추가
        if (file) {
            formData.append("file", file);
        }

        // POST 요청
        axios
            .post(`${SERVER_URL}menuRecipe/writepro`, formData, {
                headers: {
                    // 'Content-Type'은 Axios가 자동으로 처리함
                },
            })
            .then((response) => {
                window.alert("게시글이 성공적으로 등록되었습니다.");
                navigate("/mealResource/menu-recipe"); // 성공 시 목록 페이지로 이동
            })
            .catch((err) => {
                if (err.response && err.response.status === 409) {
                    // 409 Conflict 상태 코드 예시
                    setError("제목이나 작성자가 중복되었습니다.");
                } else {
                    console.error("게시글 등록 중 오류가 발생했습니다.", err);
                    setError("게시글 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
                }
            })
            .finally(() => {
                setLoading(false); // 로딩 상태 종료
            });
    };

    return (
        <div className="meal-resource-write-container">
            <div className="meal-resource-card">
                <div className="meal-resource-card-body">
                    <h2>새 게시판 작성</h2>
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
                                required
                            />
                        </div>

                        <div className="meal-resource-form-group">
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

                        <div className="meal-resource-form-group">
                            <FormControl fullWidth required>
                                <InputLabel>연령대</InputLabel>
                                <Select
                                    value={ageGroup}
                                    onChange={handleAgeGroupChange}
                                    label="연령대"
                                >
                                    <MenuItem value="기타">10대 이하</MenuItem>
                                    <MenuItem value="10대">10대</MenuItem>
                                    <MenuItem value="20대">20대</MenuItem>
                                    <MenuItem value="30대">30대</MenuItem>
                                    <MenuItem value="40대">40대</MenuItem>
                                    <MenuItem value="40대 이상">40대 이상</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="meal-resource-form-group">
                            <FormControl fullWidth required>
                                <InputLabel>시기별</InputLabel>
                                <Select
                                    value={season}
                                    onChange={handleSeasonChange}
                                    label="시기별"
                                >
                                    <MenuItem value="spring">봄</MenuItem>
                                    <MenuItem value="summer">여름</MenuItem>
                                    <MenuItem value="autumn">가을</MenuItem>
                                    <MenuItem value="winter">겨울</MenuItem>
                                    <MenuItem value="four_seasons">기타(사계절)</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="meal-resource-form-group">
                            <label>첨부파일:</label>
                            <input
                                type="file"
                                accept="image/*, .pdf, .docx"
                                onChange={handleFileChange}
                            />
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
                                onClick={() => navigate("/mealResource/menu-recipe")}
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

export default MenuRecipeWrite;
