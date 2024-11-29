import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealEdit.css";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";

function MealPolicyOperationEdit() {
    const [mealPolicyOperation, setMealPolicyOperation] = useState({
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
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    useEffect(() => {
        fetch(SERVER_URL + "mealPolicyOperations/" + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
                }
                return response.json();
            })
            .then(data => {
                setMealPolicyOperation({
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
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

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
            setMealPolicyOperation({
                ...mealPolicyOperation,
                file: file || null,
            });
        } else {
            setMealPolicyOperation({
                ...mealPolicyOperation,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", mealPolicyOperation.title);
        formData.append("writer", mealPolicyOperation.writer);
        formData.append("content", mealPolicyOperation.content);

        if (mealPolicyOperation.file) {
            formData.append("file", mealPolicyOperation.file);
        } else if (mealPolicyOperation.fileId) {
            formData.append("fileId", mealPolicyOperation.fileId);
        }

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await fetch(SERVER_URL + "mealPolicyOperation/update/" + id, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "수정에 실패했습니다.");
            }

            alert("수정되었습니다.");
            navigate("/mealResource/meal-policy-operation");
        } catch (err) {
            console.error("Error updating:", err);
            alert("수정에 실패했습니다: " + err.message);
        }
    };

    if (loading) {
        return <div>데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="meal-edit-container">
            <div className="meal-edit-card">
                <div className="meal-edit-card-body">
                    <h2>게시글 수정</h2>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>제목:</label>
                            <input
                                type="text"
                                name="title"
                                value={mealPolicyOperation.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                name="writer"
                                value={mealPolicyOperation.writer}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>내용:</label>
                            <textarea
                                name="content"
                                rows={5}
                                value={mealPolicyOperation.content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>첨부파일</label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*,application/pdf,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="button-group">
                            <Button variant="contained" color="success" type="submit">수정 저장</Button>
                            <Button variant="outlined" onClick={() => navigate(`/mealResource/meal-policy-operation/${id}`)}>취소</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MealPolicyOperationEdit;
