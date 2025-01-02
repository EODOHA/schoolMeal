import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import LoadingSpinner from '../../common/LoadingSpinner';
import "../../../css/mealCounsel/MealCounselHistoryWrite.css";

function MealCounselHistoryWrite() {
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null); // 파일 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 인증 상태 로딩
    const navigate = useNavigate();

    const createHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': token
    });

    // @로 내담자 ID 목록 가져오기
    const [counselClientId, setCounselClientId] = useState([]);   // 대상 내담자 지정
    const [counselClientList, setCounselClientList] = useState([]);
    const [filteredCounselClients, setFilteredCounselClients] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);


    // 내담자 목록 @(멘션) 으로 자동완성 -------------------------------------------------------------

    // 멤버 목록 가져오기
    useEffect(() => {
        fetch(`${SERVER_URL}members`, {
            headers: createHeaders()
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("서버로부터 받은 사용자 데이터: ", data);
                const counselClientIds = data._embedded?.members.map((member) => member.memberId) || [];
                // console.log(counselClientIds);
                setCounselClientList(counselClientIds);  // memberId 배열로 상태 업데이트
            })
            .catch((error) => console.err("내담자 목록 가져오기 실패:", error));
    }, []);

    // @ 입력 감지 및 자동완성 목록 표시
    const handleCounselClientInputChange = (e) => {
        const input = e.target.value;
        setCounselClientId(input);

        const atIndex = input.lastIndexOf("@");
        if (atIndex >= 0) {
            const search = input.substring(atIndex + 1); // '@' 이후 텍스트
            // console.log("현재 idList:", counselClientList); // 디버깅용 로그

            if (Array.isArray(counselClientList)) {
                const filtered = counselClientList.filter((user) =>
                    user.toLowerCase().startsWith(search.toLowerCase())
                );
                setFilteredCounselClients(filtered);
                setShowAutocomplete(filtered.length > 0);
            } else {
                console.error("counselClientList가 배열이 아닙니다.", counselClientList);
                setShowAutocomplete(false); // 목록 숨김
            }
        } else {
            setShowAutocomplete(false);
        }
    };

    // 자동완성 UI 추가.
    const handleAutocompleteSelect = (selectedMember) => {
        const atIndex = counselClientId.lastIndexOf("@");
        const updatedInput = counselClientId.substring(0, atIndex + 1) + selectedMember;
        setCounselClientId(updatedInput);
        setShowAutocomplete(false);
    }

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

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // counselClientId 에 @이 있는 경우 @ 다음의 문자를 counselClient로 저장
        let counselClient;
        if (counselClientId.includes("@")) {
            counselClient = counselClientId.split("@")[1];
        } else {
            counselClient = counselClientId;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);
        formData.append("counselClient", counselClient);

        if (file) {
            formData.append("file", file);
        }

        axios.post(`${SERVER_URL}mealCounselHistory/writepost`, formData, {
            headers: {
                Authorization: `${token}`,
            },
        })
            .then((response) => {
                window.alert("게시글이 성공적으로 등록되었습니다.");
                navigate("/mealCounsel/meal-counsel-history");
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
        <div className="meal-counsel-history-write-container">
            <div className="meal-counsel-history-card">
                <div className="meal-counsel-history-card-body">
                    <h2>새 게시글 작성</h2>
                    {error && <div className="meal-counsel-history-error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="meal-counsel-history-form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="meal-counsel-history-form-group">
                            <TextField
                                label="작성자"
                                fullWidth
                                value={writer}
                                onChange={(e) => setWriter(e.target.value)}
                                disabled
                            />
                        </div>
                        {/* 상담을 진행한 내담자의 ID 입력 */}
                        <div className="meal-counsel-form-group">
                            <TextField
                                label="내담자 ID "
                                placeholder="@ 입력시 사용자 아이디 조회 가능 "
                                fullWidth
                                value={counselClientId}
                                onChange={handleCounselClientInputChange}
                                required
                            />
                            {/* 자동완성 목록 */}
                            {showAutocomplete && (
                                <div style={{
                                    position: "absolute",
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    maxHeight: "100px",
                                    overflow: "auto",
                                    zIndex: 1000,
                                }}>
                                    {filteredCounselClients.map((user, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAutocompleteSelect(user)}
                                            style={{
                                                padding: "10px",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #eee",
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                                            onMouseOut={(e) => e.target.style.backgroundColor = "white"}
                                        >
                                            {user}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="meal-counsel-history-form-group">
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
                        <div className="meal-counsel-history-form-group">
                            <label>첨부파일:</label>
                            <input
                                type="file"
                                accept="image/*, .pdf, .docx, .xlsx, .hwp"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="meal-counsel-history-button-group">
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
                                onClick={() => navigate("/mealCounsel/meal-counsel-history")}
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

export default MealCounselHistoryWrite;
