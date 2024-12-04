import React, { useState } from 'react';
import { fetchSchoolCode } from '../../../FetchApi';
import { TextField, Button, List, ListItem } from '@mui/material';

const SchoolSearch = ({ onSchoolSelect }) => {
    const [schoolName, setSchoolName] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        if (!schoolName) return;
        try {
            const results = await fetchSchoolCode(schoolName);
            if (results.length === 0) {
                alert("검색된 학교가 없습니다.")
                setSchoolName(''); //검색창 초기화
                setSearchResults([]); //결과 초기화
            } else {
                setSearchResults(results);
            }
        } catch (err) {
            alert('학교 검색 중 오류가 발생했습니다.');
            setSchoolName(''); // 검색창 초기화
            setSearchResults([]); // 결과 초기화
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelectSchool = (school) => {
        const schoolCode = school.SD_SCHUL_CODE;
        const eduOfficeCode = school.ATPT_OFCDC_SC_CODE;
        const schoolName = school.SCHUL_NM;
        const startDate = school.MLSV_FROM_YMD;
        const endDate = school.MLSV_TO_YMD;

        onSchoolSelect({
            schoolCode: schoolCode,
            eduOfficeCode: eduOfficeCode,
            schoolName: schoolName,
            startDate: startDate,
            endDate: endDate
        }); // 선택된 학교 정보를 부모로 전달
        setSearchResults([]); // 검색 결과 초기화
        setSchoolName(''); // 검색창 초기화
    };

    return (
        <div>
            <TextField
                label="학교 이름을 입력하세요."
                variant='outlined'
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                style={{ marginBottom: '10px' }}
            />

            <Button
                variant='contained'
                color="primary"
                onClick={handleSearch}
                style={{ marginBottom: "20px" }}
            >
                학교 검색
            </Button>
            {searchResults.length > 0 && (
                <List>
                    {searchResults.map((school, index) => (
                        <ListItem
                            key={index}
                            button
                            onClick={() => handleSelectSchool(school)}
                            style={{ cursor: 'pointer' }}
                        >
                            {school.SCHUL_NM} ({school.LCTN_SC_NM}){/* 학교 이름 표시 */}
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default SchoolSearch;
