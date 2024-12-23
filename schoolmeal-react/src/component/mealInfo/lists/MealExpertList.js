import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../../Constants.js';
import '../../../css/mealInfo/MealExpertList.css';
import '../../../css/mealInfo/MealInfoList.css';
import MealExpertWrite from '../writes/MealExpertWrite.js';
import MealExpertEdit from '../edits/MealExpertEdit.js';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, CircularProgress } from '@mui/material';
import { useAuth } from '../../sign/AuthContext.js';
import Pagination from '@mui/material/Pagination';

function MealExpertList() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, isAdmin, isBoardAdmin } = useAuth();
    const [currentPage, setCurrentPage] = useState(1); //현재 패이지
    const itemsPerPage = 4; // 페이지당 카드 수

    const navigate = useNavigate();

    const fetchExperts = useCallback((page) => {
        setLoading(true);

        fetch(`${SERVER_URL}mealExpert`)
            .then(response => response.json()) //json 형태로 변환
            .then(data => {
                // console.log('불러온 전문가 목록:', data); // 데이터가 제대로 로드되는지 확인
                setExperts(data);
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = experts.slice(indexOfFirstItem, indexOfLastItem);

                if (currentItems.length === 0 && page > 1) {
                    setCurrentPage(page - 1);
                }
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, [itemsPerPage, currentPage]);

    useEffect(() => {
        fetchExperts(currentPage);
    }, [currentPage, fetchExperts]);

    //페이지 변경 함수
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    }

    // 현재 페이지에 해당하는 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = experts.slice(indexOfFirstItem, indexOfLastItem);

    // 전문가 수정
    const updateExpert = (expert) => {
        const payload = {
            exp_name: expert.exp_name,
            exp_department: expert.exp_department,
            exp_position: expert.exp_position,
            exp_email: expert.exp_email,
            qualifications: expert.qualifications || [],
            histories: expert.histories || [],
        };
        console.log("보내는 데이터:", payload); // 데이터 확인
        // console.log("자격증 배열:", expert.qualifications);
        // console.log("경력 사항 배열:", expert.histories);


        axios.put(
            `${SERVER_URL}mealExpert/${expert.exp_id}`, payload,
            {
                headers: {
                    "Authorization": token,  // Authorization 헤더에 토큰을 추가
                    "Content-Type": "application/json"  // JSON 형식으로 데이터 전송
                }
            })
            .then(response => {
                console.log("전문인력 정보 수정 완료:", response.data);
                alert("전문인력 정보가 수정되었습니다.")
                fetchExperts();
            })
            .catch(error => {
                console.error("전문인력 수정 오류", error);

            })
    }

    // 전문가 삭제
    const deleteExpert = (exp_id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            axios.delete(`${SERVER_URL}mealExpert/${exp_id}`, {
                headers: {
                    'Authorization': token,
                    "Content-Type": "application/json"
                }
            })
                .then(() => {
                    alert('인력 정보가 삭제되었습니다.');
                    fetchExperts(currentPage);
                    console.log(`${SERVER_URL}mealExpert/${exp_id}`);

                })
                .catch((error) => {
                    console.error("삭제 실패: ", error);
                    alert("삭제 중 오류가 발생하였습니다.");
                    fetchExperts(currentPage);
                })
        }
    }
    // 전문가 추가 
    const addExpert = (expert) => {
        setExperts(prevExperts => [...prevExperts, expert]);
        fetchExperts();
    };

    // 상세보기 페이지로 전환하는 함수
    const goToDetailPage = (exp_id) => {
        console.log(`${SERVER_URL}mealExpert/${exp_id}`);  // 요청 URL 확인

        navigate(`/mealInfo/meal-expert/${exp_id}`);
    }
    return (
        <div> {
            loading ? (
                <div> <CircularProgress /></div >
            ) : (
                <div className="meal-expert-list-container">
                    <h1 className='meal-expert-title'>급식 전문가 인력관리</h1>
                    <br />
                    {/* 추가버튼 isAdmin 또는 isBoardAdmin이 true일 때만 보이도록 함 */}
                    {(isAdmin || isBoardAdmin) && (
                        <Stack sx={{ mt: 2, mb: 2 }}>
                            <MealExpertWrite addExpert={(newExpert) => {
                                console.log("추가된 전문가 데이터:", newExpert); // 전달된 데이터 확인
                                addExpert(newExpert);
                            }} />
                        </Stack>
                    )}
                    <div className="expert-list">
                        {experts.length === 0 ? (
                            <div >
                                등록된 인력이 없습니다.
                            </div>
                        ) : (
                            currentItems.map((expert, index) => (
                                <div key={index} className="expert-card">
                                    {/* 프로필 이미지 */}
                                    <img
                                        src='/mealInfo/expert-default-profile.png'
                                        alt="프로필"
                                        className="profile-image"
                                    />

                                    {/* 전문인력 정보 */}
                                    <div className="expert-profile-text">
                                        <div style={{ textAlign: "center" }}>{expert.exp_id}</div>
                                        <div className="expert-profile-info">
                                            <span className="expert-info-label">이    름:</span> {expert.exp_name}
                                        </div>
                                        <div className="expert-profile-info">
                                            <span className="expert-info-label">소    속:</span> {expert.exp_department}
                                        </div>
                                        <div className="expert-profile-info">
                                            <span className="expert-info-label">직    급:</span> {expert.exp_position}
                                        </div>
                                        <div className="expert-profile-info">
                                            <span className="expert-info-label">이 메 일:</span> {expert.exp_email}
                                        </div>
                                        <br />
                                        {/* 상세보기 버튼 */}
                                        <Button className="detail-card" variant="contained" onClick={() => goToDetailPage(expert.exp_id)}>상세보기</Button>
                                        {/* 삭제 및 수정 버튼 isAdmin또는 isBoardAdmin이 true일 때만 보이도록 함*/}

                                        {(isAdmin || isBoardAdmin) && (
                                            <div className="expert-buttons-container">
                                                <MealExpertEdit data={expert} updateExpert={updateExpert} />
                                                <IconButton onClick={() => deleteExpert(expert.exp_id)}>
                                                    <DeleteIcon color="white" />
                                                </IconButton>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* 페이지네이션 */}
                    <div className="pagination">
                        <Pagination
                            count={Math.ceil(experts.length / itemsPerPage)}  // 페이지 개수
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </div>
                </div>
            )}</div>
    );
}
export default MealExpertList;