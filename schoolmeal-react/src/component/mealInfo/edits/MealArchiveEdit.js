import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../Constants';
import { Button } from '@mui/material';
import '../../../css/mealInfo/MealInfoEdit.css';

function MealArchiveEdit({ archive, setEditMode, setArchive }) {
    const [updatedArchive, setUpdatedArchive] = useState(archive); // 수정된 데이터를 관리
    const [newFile, setNewFile] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setUpdatedArchive(archive); // archive prop가 변경되면 상태 업데이트
    }, [archive]);

    // 수정된 데이터를 서버에 PUT 요청으로 전송
    const handleSave = (e) => {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData();
        formData.append("arc_title", updatedArchive.arc_title);
        formData.append("arc_content", updatedArchive.arc_content);
        formData.append("arc_author", updatedArchive.arc_author);

        //새로운 파일이 선택되었으면 추가
        if (newFile) {
            formData.append("file", newFile);
        }

        // 수정된 게시글 데이터 전송
        axios.put(`${SERVER_URL}mealArchive/${updatedArchive.arc_id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then((response) => {
                setLoading(false);
                setEditMode(false); // 수정 완료 후 수정모드 비활성화
                alert("수정이 완료되었습니다.");
                setArchive(response.data); //부모 컴포넌트의 상태 갱신


            })
            .catch((error) => {
                setLoading(false);
                console.error("수정 실패", error);
                alert("수정 중 오류가 발생했습니다.");
            });
    };
    // 취소 버튼 클릭 시 수정 모드 종료
    const handleCancel = (e) => {
        e.preventDefault(); //폼 제출 방지
        setEditMode(false); //수정보드 비활성화
        alert("수정이 취소되었습니다.")
    }

    // 폼 입력값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedArchive({ ...updatedArchive, [name]: value });
    };

    // 파일 선택 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // 첫번째 파일만 선택
        if (file) {
            setNewFile(file); // 새로운 파일 상태 

            //파일이 이미지인지 확인
            if (file.type.startsWith("image/")) { //파일의 타입이 image 로 시작하면
                const reader = new FileReader();
                reader.onloadend = () => {
                };
                reader.readAsDataURL(file); //이미지 파일을 base64 형식으로 읽기
            } else {
            }

        }
    };
    if (loading) {
        return <div>데이터를 불러오는 중...</div>;
    }
    if (error) {
        return <div className="meal-info-error-message">{error}</div>;
    }

    return (
        <div className="meal-info-edit-container">
            <div className="meal-info-card">
                <div className="meal-info-card-body">
                    <h2>게시글 수정</h2>
                    <form onSubmit={handleSave}>
                        <div className="meal-info-form-group">
                            <label>제목:</label>
                            <input
                                type="text"
                                name="arc_title"
                                value={updatedArchive.arc_title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="meal-info-form-group">
                            <label>작성자:</label>
                            <input
                                type="text"
                                name="arc_author"
                                value={updatedArchive.arc_author || "관리자"}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </div>
                        <div className="meal-info-form-group">
                            <label>내용:</label>
                            <textarea
                                name="arc_content"
                                rows={5}
                                value={updatedArchive.arc_content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="meal-info-form-group">
                            <label>첨부파일</label>
                            <input
                                type="file"
                                name="file"
                                // accept="image/*,application/pdf,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={handleFileChange}
                            />
                            {/* 기존 파일 표시 */}
                            {archive.arc_files && archive.arc_files.length > 0 && (
                                <div>
                                    <p>📁현재 첨부파일 : {archive.arc_files.map(file => file.arc_originalFilename).join(",")}</p>
                                </div>
                            )}
                        </div>
                        <div className="meal-info-button-group">
                            <Button variant="contained" color="success" type="submit">수정 완료</Button>
                            <Button variant="outlined" onClick={handleCancel}>취소</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MealArchiveEdit;

