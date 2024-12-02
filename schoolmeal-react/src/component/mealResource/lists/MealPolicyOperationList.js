import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealList.css";
import Button from "@mui/material/Button";
import { MdAttachFile } from "react-icons/md";
import { BsFileExcel } from "react-icons/bs";

function MealPolicyOperationList() {
    const [mealPolicyOperation, setMealPolicyOperation] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    // 컴포넌트가 마운트되면 목록을 가져옴
    useEffect(() => {
        fetch(SERVER_URL + "mealPolicyOperations")
            .then(response => response.json())
            .then(data => {
                // 데이터를 역순으로 정렬하여 setState
                setMealPolicyOperation(data._embedded.mealPolicyOperations.reverse());
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 상세 페이지로 이동하는 함수
    const goToDetailPage = (mealPolicyOperation) => {
        const policyId = mealPolicyOperation.id || (mealPolicyOperation._links?.self?.href ? extractIdFromHref(mealPolicyOperation._links.self.href) : null);
        if (!policyId) {
            console.error("Invalid ID:", policyId);
            return;
        }
        navigate(`/mealResource/meal-policy-operation/${policyId}`);
    };

    // URL에서 ID를 추출하는 함수
    const extractIdFromHref = (href) => {
        const parts = href.split('/');
        return parts[parts.length - 1];
    };

    // 목록 길이
    const totalLength = mealPolicyOperation.length;

    return (
        <div className="meal-list-container">
            <h1 className="title">급식 정책 및 운영</h1>
            <div className="button-group">
                <Button variant="outlined" onClick={() => navigate("/mealResource")}>
                    이전으로
                </Button>
                <Button variant="outlined" onClick={() => navigate("/mealResource/meal-policy-operation/write")} style={{ marginLeft: "auto" }}>
                    새 글 쓰기
                </Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>작성자</th>
                        <th>첨부파일</th>
                    </tr>
                </thead>
                <tbody>
                    { (mealPolicyOperation && mealPolicyOperation.length === 0) ? (
                        <tr>
                            <td colSpan="5">데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        mealPolicyOperation && mealPolicyOperation.map((mealPolicyOperation, index) => {
                            const isSelected = id && mealPolicyOperation.id && id === mealPolicyOperation.id.toString();
                        
                            // fileUrl은 fileId가 존재할 때만 유효한 것으로 처리
                            const fileUrl = mealPolicyOperation.fileId ? mealPolicyOperation._links?.fileUrl?.href : null;

                            // 역순으로 번호 표시
                            const reversedIndex = totalLength - index;

                            return (
                                <tr
                                    key={mealPolicyOperation.id || `mealPolicyOperation-${index}`}
                                    onClick={() => goToDetailPage(mealPolicyOperation)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#e0f7fa" : "white",
                                    }}
                                >
                                    <td>{reversedIndex}</td>
                                    <td>{mealPolicyOperation.title}</td>
                                    <td>{formatDate(mealPolicyOperation.createdDate)}</td>
                                    <td>{mealPolicyOperation.writer}</td>
                                    <td>
                                        {fileUrl ? (
                                            <span className="attachment-icon"><MdAttachFile /></span>
                                        ) : (
                                            <span className="attachment-icon"><BsFileExcel /></span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })                                                             
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MealPolicyOperationList;
