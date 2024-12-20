import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../css/mealInfo/MealInfoDetail.css';
import { SERVER_URL } from '../../../Constants';
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileUnknowFill } from "react-icons/ri";
import { Button } from "@mui/material";
import MealArchiveEdit from '../edits/MealArchiveEdit';
import { useAuth } from '../../sign/AuthContext';
import LoadingSpinner from '../../common/LoadingSpinner';


function MealArchiveDetails() {
    const { id } = useParams(); // arc_id URL 파라미터로 가져오기
    const [archive, setArchive] = useState(null); // 게시글 데이터
    const [isAuthor, setIsAuthor] = useState(false);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [editMode, setEditMode] = useState(false); // 수정모드 상태
    const [setError] = useState(null); // 오류 상태
    const navigate = useNavigate();

    // 권한설정 -> useAuth에서 token과 isAdmin, isBoardAdmin을 가져옴
    const { token, isAdmin, isBoardAdmin, role } = useAuth();
    // console.log("URL에서 추출한 arc_id", id);

    // 상세 페이지 조회 API 호출
    useEffect(() => {
        if (!id) {
            setError("유효하지 않은 ID입니다.");
            setLoading(false);
            return;
        }
        // 상세페이지 조회 api 호출
        axios.get(`${SERVER_URL}mealArchive/${id}`, {
            headers: {
                "Authorization": token
            },
        })
            .then(response => {
                setArchive(response.data); // 데이터를 받아서 상태에 저장

                // 작성자 확인 로직
                const isAuthor =
                    (isAdmin && (response.data.arc_author === "관리자")) ||
                    (isBoardAdmin && (response.data.arc_author === "담당자"))
                    ;
                setIsAuthor(isAuthor);
                // console.log("isAdmin:", isAdmin);
                // console.log("isBoardAdmin:", isBoardAdmin);
                // console.log("isAuthor", isAuthor);
                // console.log("role:", role);


                // console.log("상세 페이지 정보", response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("상세 조회 실패", error);
                setError("데이터를 가져오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [id, isAdmin, isBoardAdmin, role, token, setError]);

    // 로딩 중일 때 화면 표시
    if (loading) {
        return <div><LoadingSpinner /></div>;
    }

    // 아카이브 데이터가 없을 경우 처리
    if (!archive) {
        return <div>데이터를 찾을 수 없습니다.</div>;
    }

    // 수정 버튼 클릭 시 editMode 활성화
    const handleUpdate = () => {
        setEditMode(true); // 수정모드 활성화
    }

    // 삭제 버튼 클릭 시 삭제API 호출 후 목록 페이지로 이동
    const handleDelete = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;

        axios.delete(`${SERVER_URL}mealArchive/${id}`, {
            headers: {
                "Authorization": token,
            }
        })
            .then(() => {
                alert("게시글이 삭제되었습니다.");
                navigate("/mealInfo/meal-archive");
            })
            .catch((error) => {
                console.error("삭제 실패: ", error);
                alert("삭제 중 오류가 발생하였습니다.");
            })
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return (
            <>
                {`${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`}
            </>
        );
    };
    return (
        <div className="meal-info-detail-container">
            {editMode ? (   //editMode가 true면 MealArchive 컴포넌트 호출
                <MealArchiveEdit archive={archive} setEditMode={setEditMode} setArchive={setArchive} />
            ) : (
                <div className="meal-info-card">
                    <div className="meal-info-card-body">
                        <h2>{archive.arc_title}</h2>
                        <hr />
                        <div className="meal-info-header">
                            <span className="meal-info-id">글번호: {archive.arc_id}</span>
                            <span className="meal-info-date">작성일: {formatDate(archive.createdDate)}</span>
                        </div>

                        <div className="meal-info-attachment">
                            {archive.arc_files && archive.arc_files.length > 0 ? (
                                archive.arc_files.map(file => {
                                    const fileUrl = `${SERVER_URL}mealArchive/download/${encodeURIComponent(file.arc_storedFilename)}`;
                                    return (
                                        <div key={file.arc_file_id}>
                                            <a href={fileUrl} download className="meal-info-attachment-link">
                                                {file.arc_originalFilename} <MdOutlineFileDownload />
                                            </a>
                                        </div>
                                    );
                                })
                            ) : (
                                <span>첨부파일 없음 &nbsp; <RiFileUnknowFill /></span>
                            )}
                        </div>< br />
                        <form>
                            <div className="meal-info-form-group">
                                <label>작성자:</label>
                                <input
                                    type="text"
                                    value={archive.arc_author}
                                    readOnly
                                    className="meal-info-form-control"
                                />
                            </div><br />
                            <div className="meal-info-form-group">
                                <label>내용:</label>
                                <textarea
                                    rows={1}
                                    value={archive.arc_content}
                                    readOnly
                                    className="meal-info-form-control"
                                />
                            </div><br />
                        </form>
                        <div className="meal-info-button-group">
                            {/* 수정은 작성자 본인, 삭제는 관리자도 선택 가능 */}
                            {isAuthor && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={handleUpdate}
                                    disabled={!isAuthor}
                                >
                                    수정
                                </Button>
                            )}
                            {(isAuthor || isAdmin) && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDelete}
                                    disabled={(!isAuthor && !isAdmin)}
                                >
                                    삭제
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/mealInfo/meal-archive")}
                            >
                                목록
                            </Button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default MealArchiveDetails;