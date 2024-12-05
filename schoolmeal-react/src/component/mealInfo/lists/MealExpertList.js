import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../../Constants.js';
import '../../../css/mealInfo/MealExpertList.css';
import '../../../css/mealInfo/MealInfoList.css';
import { Snackbar } from '@mui/material';
import MealExpertWrite from '../writes/MealExepertWrite.js';
import MealExpertEdit from '../edits/MealExpertEdit.js';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


function MealExpertList() {
    const [experts, setExperts] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = () => {
        fetch(`${SERVER_URL}mealInfo/experts`)
            .then(response => response.json()) //json 형태로 변환
            .then(data => {
                console.log('불러온 전문가 목록:', data); // 데이터가 제대로 로드되는지 확인
                setExperts(data)
            }) //  받아온 데이터를 상태에 저장
            .catch(error => console.error(error));
    }

    // 새로운 인력 추가
    const addExpert = (expert) => {

        axios.post(`${SERVER_URL}mealInfo/experts`, {
            exp_id: expert.exp_id,
            exp_name: expert.exp_name,
            exp_department: expert.exp_department,
            exp_position: expert.exp_position,
            exp_email: expert.exp_email,
            qualifications: expert.qualifications,
            histories: expert.histories
            // exp_profileImg: expert.exp_profileImg,
        },
        )
            .then(response => {
                console.log("전문인력추가 성공", response.data);
                alert("전문인력 정보가 저장되었습니다.")
                fetchExperts(); // 목록을 다시 로드
            })
            .catch(error => {

                console.error('전문인력 저장 실패:', error);
                alert('전문인력 저장 실패');
            });
    };

    // 인력 삭제
    const onDelClick = (url) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        fetchExperts();
                        setOpen(true);
                    }
                    else {
                        alert('오류가 발생했습니다!');
                    }
                })
                .catch(err => console.error(err))
        }
    }

    // 인력 수정
    const updateExpert = (expert) => {
        axios.put
            (`${SERVER_URL}mealInfo/experts/${expert.exp_id}`, {
                exp_id: expert.exp_id,
                exp_name: expert.exp_name,
                exp_department: expert.exp_department,
                exp_position: expert.exp_position,
                exp_email: expert.exp_email,
                qualifications: expert.qualifications,
                histories: expert.histories
            })
            .then(response => {
                console.log("전문인력 정보 수정 완료:", response.data);
                alert("전문인력 정보가 수정되었습니다.")
                fetchExperts();

            })
            .catch(error => {
                console.error("Error updating expert", error);
                alert("오류가 발생했습니다.");
            })
    }

    return (
        <div className="meal-info-list-container">
            <h1 className='meal-info-title'>급식 전문가 인력관리</h1>
            <br />
            <Stack sx={{ mt: 2, mb: 2 }}>
                {/* 추가버튼 */}
                <MealExpertWrite addExpert={addExpert} />
            </Stack>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                message="인력 정보가 삭제되었습니다."
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                ContentProps={{
                    style: {
                        backgroundColor: '#4caf50',
                        color: 'white',
                    },
                }}
            />
            <div className="expert-list">
                {experts.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        등록된 인력이 없습니다.
                    </p>
                ) : (
                    experts.map((expert, index) => (
                        <div key={index} className="expert-card">
                            <div className="expert-profile-text">
                                <div style={{ textAlign: "center" }}>{expert.exp_id}</div>
                                <div className="expert-profile-info">
                                    <span className="expert-info-label">이름:</span> {expert.exp_name}
                                </div>
                                <div className="expert-profile-info">
                                    <span className="expert-info-label">소속:</span> {expert.exp_department}
                                </div>
                                <div className="expert-profile-info">
                                    <span className="expert-info-label">직급:</span> {expert.exp_position}
                                </div>
                                <div className="expert-profile-info">
                                    <span className="expert-info-label">이메일:</span> {expert.exp_email}
                                </div>
                                <div className="expert-profile-info">
                                    <span className="expert-info-label">보유자격:</span>
                                    <ul>
                                        {expert.qualifications.map((qualification, qIndex) => (
                                            <li key={qIndex}>{qualification.exp_qual_description}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="expert-profile-info">
                                    <span className="expert-info-label">경력사항:</span>
                                    <ul>
                                        {expert.histories.map((history, hIndex) => (
                                            <li key={hIndex}>{history.exp_hist_description}</li>
                                        ))}
                                    </ul>
                                </div>
                                {/* 상세보기 -- 미구현 */}
                                <button>상세보기</button>

                                {/* 삭제 및 수정 버튼 */}
                                <div className="expert-buttons-container">
                                    <MealExpertEdit data={expert} updateExpert={updateExpert} />
                                    <IconButton onClick={() => onDelClick(`${SERVER_URL}mealInfo/experts/${expert.exp_id}`)}>
                                        <DeleteIcon color="white" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
}
export default MealExpertList;