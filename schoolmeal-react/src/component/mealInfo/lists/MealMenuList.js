import React, { useState, useEffect } from 'react';
import { parse, format, addDays, startOfWeek, subDays, endOfMonth, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button, Box, Typography } from '@mui/material';
import '../../../css/mealInfo/MealMenuList.css';

const MealMenuList = ({ meals, selectedMonth, monthStart }) => {
    // console.log("MealList에서 받은 데이터", meals);
    // console.log("선택된 월", selectedMonth);
    const [currentDate, setCurrentDate] = useState(() => parse(monthStart, 'yyyyMMdd', new Date()));


    // 선택된 월의 첫 번째 날짜를 계산
    const getStartOfMonth = (month) => {
        return parse(month, 'yyyyMM', new Date()); // "YYYYMM" 형식에서 첫날을 계산
    };

    // monthStart가 변경될 때마다 currentDate를 다시 설정
    useEffect(() => {
        const firstDay = parse(monthStart, 'yyyyMMdd', new Date());
        setCurrentDate(firstDay);
    }, [monthStart])

    useEffect(() => {
        // console.log('MealList - 초기 currentDate:', currentDate);
        // console.log('MealList - monthStart:', monthStart);
    }, [currentDate, monthStart]);

    // 선택된 월의 첫 번째 날을 기준으로 주의 시작일과 종료일 계산
    const getWeekRange = (startOfMonth, offset = 0) => {
        // 기준일에서 offset만큼 이동 후 주 시작일과 종료일 계산
        const startOfWeekDate = startOfWeek(addDays(startOfMonth, offset * 7), { weekStartsOn: 0 }); // 일요일 시작
        const endOfWeekDate = addDays(startOfWeekDate, 6); // 토요일
        return { start: startOfWeekDate, end: endOfWeekDate };
    };

    // 날짜 범위에 맞는 식단을 필터링 (조식, 중식, 석식)
    const getMealsForWeek = (start, end) => {
        return meals.filter((meal) => {
            const mealDate = parse(meal.MLSV_YMD, 'yyyyMMdd', new Date());
            return mealDate >= start && mealDate <= end;
        });
    };

    // 주의 날짜와 식단을 렌더링
    const renderWeek = () => {
        const startOfSelectedMonth = getStartOfMonth(selectedMonth);
        const { start, end } = getWeekRange(startOfSelectedMonth, Math.floor((currentDate.getDate() - 1) / 7));

        // console.log('MealList 주 시작일:', start);
        // console.log('MealList 주 종료일', end);

        const mealsForWeek = getMealsForWeek(start, end);  // 해당 주에 해당하는 식단 필터링

        // console.log('이번 주의 급식 데이터:', mealsForWeek);

        // 문자열 안의 <br /> 태그를 개행 문자로 변환
        const convertBrToNewline = (str) => {
            return str.replace(/<br\s*\/?>/gi, '\n');
        };

        // 요일 배열
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

        // 각 날짜별 급식 데이터 (조식, 중식, 석식)
        const daysMeals = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = addDays(start, i);
            const formattedDate = format(currentDay, 'MM/dd', { locale: ko });

            const dayMeals = mealsForWeek.filter(meal =>
                parse(meal.MLSV_YMD, 'yyyyMMdd', new Date()).getDay() === currentDay.getDay()
            );

            // 하루에 대한 급식 데이터 분리 (조식, 중식, 석식)
            const breakfast = dayMeals.filter(meal => meal.MMEAL_SC_NM === "조식");
            const lunch = dayMeals.filter(meal => meal.MMEAL_SC_NM === "중식");
            const dinner = dayMeals.filter(meal => meal.MMEAL_SC_NM === "석식");

            daysMeals.push({
                date: formattedDate,
                breakfast: breakfast.length > 0 ? breakfast.map((meal) => convertBrToNewline(meal.DDISH_NM)) : [" "],
                lunch: lunch.length > 0 ? lunch.map((meal) => convertBrToNewline(meal.DDISH_NM)) : [" "],
                dinner: dinner.length > 0 ? dinner.map((meal) => convertBrToNewline(meal.DDISH_NM)) : ["  "],
            });
        }


        return (
            <div>
                <table className="meal-menu-table">
                    <thead>
                        <tr>
                            <th>구분</th>
                            {daysMeals.map((meal, index) => {
                                const mealDate = parse(meal.date, 'MM/dd', new Date());
                                const isSameMonthAsSelectedMonth = isSameMonth(mealDate, startOfSelectedMonth); // 같은 월인지 확인

                                return (
                                    <th key={index}>
                                        <div>{daysOfWeek[index]}</div>  {/* 요일 */}
                                        {isSameMonthAsSelectedMonth && <div>{meal.date}</div>}  {/* 날짜 (선택된 월에만 표시) */}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {/* 조식 */}
                        <tr>
                            <td>조식</td>
                            {daysMeals.map((meal, index) => (
                                <td key={index}>
                                    {meal.breakfast.map((dish, idx) => (
                                        <div style={{ whiteSpace: "pre-line" }} key={idx}>{dish}</div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                        {/* 중식 */}
                        <tr>
                            <td>중식</td>
                            {daysMeals.map((meal, index) => (
                                <td key={index}>
                                    {meal.lunch.map((dish, idx) => (
                                        <div style={{ whiteSpace: "pre-line" }} key={idx}>{dish}</div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                        {/* 석식 */}
                        <tr>
                            <td>석식</td>
                            {daysMeals.map((meal, index) => (
                                <td key={index}>
                                    {meal.dinner.map((dish, idx) => (
                                        <div style={{ whiteSpace: "pre-line" }} key={idx}>{dish}</div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                {/* 참고내용 */}
                <div className="meal-menu-comment">
                    <h4>참고내용:</h4>
                    <p>
                        - 요리명에 표시된 번호: 알레르기를 유발할 수 있는 식재료입니다.
                    </p>
                    <p>
                        - 알레르기 유발 식재료 번호: 1. 난류, 2. 우유, 3. 메밀, 4. 땅콩, 5. 대두, 6. 밀, 7. 고등어, 8. 게, 9. 새우, 10. 돼지고기, 11. 복숭아, 12. 토마토, 13. 아황산류, 14. 호두, 15. 닭고기, 16. 쇠고기, 17. 오징어, 18. 조개류(굴, 전복, 홍합 포함), 19. 잣
                    </p>
                </div>
            </div>
        );
    };

    // 이전 주로 이동
    const goToPreviousWeek = () => {
        const newDate = subDays(currentDate, 7);
        const startOfMonth = startOfSelectedMonth;

        // 만약 newDate가 해당 월의 첫날보다 이전이라면, 버튼 비활성화
        if (newDate < startOfMonth) {
            setCurrentDate(startOfMonth);  // 첫날로 설정하여 더 이상 이전으로 가도록 막음
            alert("해당 월이 종료되었습니다. 새로운 월을 선택해주세요");  // 알림창 표시
        } else {
            setCurrentDate(newDate);
        }
    };


    // 다음 주로 이동
    const goToNextWeek = () => {
        const newDate = addDays(currentDate, 7);
        const endOfMonth = endOfSelectedMonth;

        // 만약 newDate가 해당 월의 마지막 날짜보다 크다면, 버튼 비활성화
        if (newDate > endOfMonth) {
            setCurrentDate(endOfMonth);  // 마지막 날짜로 설정하여 더 이상 넘어가지 않도록
            alert("해당 월이 종료되었습니다. 새로운 월을 선택해주세요");  // 알림창 표시
        } else {
            setCurrentDate(newDate);
        }
    };

    // 선택된 월의 첫 번째 날과 마지막 날 계산
    const startOfSelectedMonth = getStartOfMonth(selectedMonth);
    const endOfSelectedMonth = endOfMonth(startOfSelectedMonth);


    // 주 시작일과 종료일 포맷
    let { start, end } = getWeekRange(startOfSelectedMonth, Math.floor((currentDate.getDate() - 1) / 7));

    // 주 시작일이 선택된 달의 월이 아니면 첫 날로 설정
    if (start.getMonth() !== startOfSelectedMonth.getMonth()) {
        start = startOfSelectedMonth;
    }

    // 주 종료일이 선택된 달의 월이 아니면 마지막 날로 설정
    if (end.getMonth() !== startOfSelectedMonth.getMonth()) {
        end = endOfSelectedMonth;
    }
    const startFormatted = format(start, 'MM/dd', { locale: ko });
    const endFormatted = format(end, 'MM/dd', { locale: ko });

    // goToPreviousWeek 비활성화 조건: currentDate가 월의 첫날보다 작으면 비활성화
    const isPreviousWeekDisabled = currentDate <= startOfSelectedMonth;
    // goToNextWeek 비활성화 조건: currentDate가 월의 마지막 날보다 크면 비활성화
    const isNextWeekDisabled = currentDate >= endOfSelectedMonth;

    return (
        <div style={{ position: "relative" }}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Button onClick={goToPreviousWeek}
                    disabled={isPreviousWeekDisabled}
                    variant="contained"
                    sx={{
                        margin: 1,
                        bgcolor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'secondary.main', // 마우스 오버 시 색상 변경
                        },
                    }}> {"◀ 지난 주"} </Button>
                <Typography variant="h6" mx={2}>
                    {startFormatted} - {endFormatted}
                </Typography>
                <Button onClick={goToNextWeek}
                    disabled={isNextWeekDisabled}
                    variant="contained" sx={{
                        margin: 1,
                        bgcolor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'secondary.main', // 마우스 오버 시 색상 변경
                        },
                    }}>{"다음 주 ▶"}</Button>
            </Box>
            {renderWeek()}
        </div>
    );
};


export default MealMenuList;