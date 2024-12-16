import React, { useState } from 'react';
import { fetchSchoolCode } from '../../../FetchApi';
import { TextField, Button, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../../css/mealInfo/SchoolSearch.css';

const SchoolSearch = ({ onSchoolSelect }) => {
    const [schoolName, setSchoolName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const handleSearch = async () => {
        if (!schoolName) {
            alert("학교명을 입력해 주세요");
            setSearchResults([]); //결과 초기화
            return;
        }
        try {
            const results = await fetchSchoolCode(schoolName);
            if (results.length === 0) {
                alert("검색된 학교가 없습니다.")
                setSchoolName(''); //검색창 초기화
                setSearchResults([]); //결과 초기화
            } else {
                setSearchResults(results);
                setOpenModal(true); // 모달 열기
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
        const schoolData = {
            schoolCode: school.SD_SCHUL_CODE,
            eduOfficeCode: school.ATPT_OFCDC_SC_CODE,
            schoolName: school.SCHUL_NM,
            startDate: school.MLSV_FROM_YMD,
            endDate: school.MLSV_TO_YMD
        };
        onSchoolSelect(schoolData); // 선택된 학교 정보를 부모로 전달
        setOpenModal(false); // 모달 닫기
        setSearchResults([]); // 검색 결과 초기화
        setSchoolName(''); // 검색창 초기화
    };
    const handleCloseModal = () => {
        setOpenModal(false); // 모달 닫기
        setSchoolName(''); // 검색창 초기화
    };

    return (
        <div className="school-search-modal">
            <Box className="search-container">
                <TextField
                    label="학교 이름을 입력하세요."
                    variant='outlined'
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    className="search-input"
                />
                <Button
                    variant='contained'
                    color="primary"
                    onClick={handleSearch}
                    className="search-button"
                >
                    학교 검색
                </Button>
            </Box>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="학교 검색 결과"
                aria-describedby="검색된 학교 목록"
            >
                <Box className="school-search-modal-box">
                    <h2 id="학교 검색 결과">학교 검색 결과</h2>
                    {/* X 버튼 추가 */}
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'black'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header-cell">학교 이름</TableCell>
                                    <TableCell className="table-header-cell">지역</TableCell>
                                    <TableCell className="table-header-cell">선택</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResults.map((school, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="table-cell">{school.SCHUL_NM}</TableCell>
                                        <TableCell className="table-cell">{school.LCTN_SC_NM}</TableCell>
                                        <TableCell className="table-cell">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleSelectSchool(school)}
                                            >
                                                선택
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </div>
    );
};

export default SchoolSearch;