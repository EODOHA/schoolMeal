import React, { useState, useEffect } from 'react';
import { fetchMealData } from '../../../FetchApi';
import MealMenuList from '../lists/MealMenuList';
import moment from 'moment';
import { TextField, Box, Typography, CircularProgress } from '@mui/material';


const MealMenuDetail = ({ school }) => {
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYYMM')); // 현재 월로 초기화
    const [mealData, setMealData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 월 변경 핸들러
    const handleMonthChange = (e) => {
        const newMonth = e.target.value.replace('-', ''); // "YYYY-MM" -> "YYYYMM"
        // console.log("월 변경 핸들러 작동확인", e.target.value);
        setSelectedMonth(newMonth);
    };

    // 급식 데이터를 가져오는 함수
    useEffect(() => {
        const fetchMonthlyMeals = async () => {
            if (!school) {
                setError('학교 정보가 필요합니다.');
                return;
            }

            try {
                setError(null);
                setLoading(true);

                // 선택된 월의 첫째 날과 마지막 날 계산
                const monthStart = moment(selectedMonth, 'YYYYMM').startOf('month').format('YYYYMMDD');
                const monthEnd = moment(selectedMonth, 'YYYYMM').endOf('month').format('YYYYMMDD');
                // console.log(`선택된 월: ${selectedMonth}, 시작일: ${monthStart}, 종료일: ${monthEnd}`);


                // API 호출
                const meals = await fetchMealData(school.schoolCode, school.eduOfficeCode, monthStart, monthEnd);
                // console.log('mealBoard데이터:', meals);
                setMealData(meals);
            } catch (err) {
                setError('식단표 정보가 존재하지 않습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyMeals();
        // console.log("userEffect 확인", selectedMonth, school);
    }, [selectedMonth, school]);

    // 학교가 바뀔 때마다 상태 초기화 및 데이터 새로 가져오기
    useEffect(() => {
        setSelectedMonth(moment().format('YYYYMM'));
        setMealData([]);
        setError(null);
    }, [school]);

    const monthStart = moment(selectedMonth, 'YYYYMM').startOf('month').format('YYYYMMDD'); // 선택된 월의 시작일


    return (
        <Box sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant='h6' sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {school.schoolName} 식단표
                </Typography>
                <TextField
                    label="선택 월"
                    type="month"
                    value={moment(selectedMonth, 'YYYYMM').format('YYYY-MM')}
                    onChange={handleMonthChange}
                    variant="outlined"
                    sx={{ marginLeft: 2 }}  // '선택 월' 입력 필드와 타이포그래피 사이 간격 설정
                />
            </Box>
            {/* 로딩 중일 때 */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" variant="body1">{error}</Typography>
            ) : mealData.length > 0 ? (
                // MealMenuList로 mealData 전달
                <MealMenuList meals={mealData} selectedMonth={selectedMonth} monthStart={monthStart} />
            ) : (
                <Typography variant="body1" align="center">급식 정보가 없습니다.</Typography>
            )}
        </Box>
    );
};

export default MealMenuDetail;
