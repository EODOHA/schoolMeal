import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // URL 파라미터 사용
import axios from 'axios';
import { SERVER_URL } from '../../../Constants.js';
import { useAuth } from '../../sign/AuthContext.js';
import { Button, Card, CircularProgress, Typography, CardMedia } from '@mui/material';
import '../../../css/mealInfo/MealExpertDetail.css';

function MealExpertDetail() {
    const { exp_id } = useParams(); // URL에서 exp_id 받기
    const [expert, setExpert] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    // 전문가 정보 가져오기
    useEffect(() => {
        const fetchExpert = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}mealExpert/${exp_id}`, {
                    headers: {
                        'Authorization': token,
                    },
                });
                const data = response.data;
                setExpert({
                    ...data,
                    qualifications: data.qualifications || [],
                    histories: data.histories || []
                });
            } catch (error) {
                console.error('전문가 정보 가져오기 실패', error);
            }
        };
        fetchExpert();
    }, [exp_id, token]);

    const handleBackClick = () => {
        navigate('/mealInfo/meal-expert');  // 리스트 페이지로 이동
    };
    if (expert === null) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center', // 수평 가운데 정렬
            alignItems: 'center', // 수직 가운데 정렬
            height: '30vh' // 전체 화면 높이
        }} >
            <CircularProgress />
            <br />
            <p>데이터를 불러오는 중입니다....⏰</p>
        </div >;
    }

    return (
        <>
            {/* 상세정보 제목 */}
            < h1 className="meal-expert-detail-title">
                {expert.exp_name}의 상세정보
            </h1 >
            <Card className='expert-detail-card' style={{ display: 'flex' }}>
                <div className="profile-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                        component="img"
                        className="profile-image"
                        image='/mealInfo/expert-default-profile.png' // 기본이미지 설정
                        alt="프로필 이미지"
                        style={{
                            width: '200px', // 원하는 고정 크기 설정
                            height: '200px', // 원하는 고정 크기 설정
                            objectFit: 'cover', // 이미지 비율을 유지하면서 크기 조정
                        }}
                    />
                    <div className="profile-info" style={{ flex: 1 }}>
                        <Typography variant="body1"><strong>소속:</strong> {expert.exp_department}</Typography>
                        <Typography variant="body1"><strong>직급:</strong> {expert.exp_position}</Typography>
                        <Typography variant="body1"><strong>이메일:</strong> {expert.exp_email}</Typography>
                    </div>
                </div>

                <div className="qualifications-container">
                    <Typography variant="body1"><strong>보유자격:</strong></Typography>
                    <ul>
                        {expert.qualifications.length > 0 ? (
                            expert.qualifications.map((q, index) => (
                                <li key={index}>{q.exp_qual_description}</li>
                            ))
                        ) : (
                            <li>등록된 자격증이 없습니다.</li>
                        )}
                    </ul>
                </div>

                <div className="histories-container">
                    <Typography variant="body1"><strong>경력사항:</strong></Typography>
                    <ul>
                        {expert.histories.length > 0 ? (
                            expert.histories.map((h, index) => (
                                <li key={index}>{h.exp_hist_description}</li>
                            ))
                        ) : (
                            <li>등록된 경력사항이 없습니다.</li>
                        )}
                    </ul>
                </div>
                <Button variant="contained" onClick={handleBackClick} className="back-button">
                    목록으로 돌아가기
                </Button>
            </Card >
        </>
    );
}

export default MealExpertDetail;