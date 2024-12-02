// 급식정보 - 학교별 급식식단 정보 open api 호출 함수

import axios from 'axios';
import { SCHOOL_API_URL, MEAL_API_URL } from './Constants';

//학교 API 호출
export const fetchSchoolCode = async(schoolName) =>{
    const response = await axios.get(`${SCHOOL_API_URL}`, {
        params:{ KEY:process.env.REACT_APP_SCHOOL_API_KEY,
            Type:"json",
            SCHUL_NM: schoolName,
        }
    });
    // 응답 데이터 확인
    console.log('학교 데이터 :', response.data.schoolInfo[1].row[1]);
    return response.data.schoolInfo[1].row;

}

//급식 정보 API 호출
export const fetchMealData = async(schoolCode, eduOfficeCode, startDate, endDate) => {
    const response = await axios.get(`${MEAL_API_URL}`, {
        params: {
            KEY:process.env.REACT_APP_MEAL_API_KEY,
            Type:"json",
            SD_SCHUL_CODE : schoolCode,
            ATPT_OFCDC_SC_CODE: eduOfficeCode,
            MLSV_FROM_YMD : startDate,
            MLSV_TO_YMD: endDate
        }
    });

    //응답 데이터 확인
    console.log('급식정보 데이터:',response.data);

    return response.data.mealServiceDietInfo[1].row;
}