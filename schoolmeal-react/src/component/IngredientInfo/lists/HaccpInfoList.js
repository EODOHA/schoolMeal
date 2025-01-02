import '../../../css/ingredientInfo/IngredientInfoList.css';
import React, { useCallback, useEffect, useState } from "react";
import { Button, IconButton, CircularProgress, Pagination, Select, MenuItem, TextField, InputAdornment } from "@mui/material";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import * as XLSX from 'xlsx';

const HaccpInfoList = () => {

    const [haccpList, setHaccpList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHaccps, setSelectedHaccps] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false); // 전체 선택 여부
    const { token, isAdmin, isBoardAdmin } = useAuth();
    const navigate = useNavigate();

    // ------------------------ 페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1);       // 현재 페이지 1부터 시작
    const [totalPages, setTotalPages] = useState();          // 전체 페이지 수(임베디드데이터 이름)
    const [pageSize, setPageSize] = useState(10);             // 페이지 당 게시글 수(임베디드데이터이름: size)
    const [totalElements, setTotalElements] = useState();    // 전체 게시글 수(임베디드데이터 이름)

    // ------------------------ 검색 관련 상태
    const [businessName, setBusinessName] = useState("");

    // 데이터 목록 가져오기 -> 페이지와 크기 파라미터를 추가하여 전체 페이지 수 설정
    const fetchHaccpData = useCallback(async (page = currentPage - 1, size = pageSize) => {
        setLoading(true);
        // 기본값
        let apiUrl = `${SERVER_URL}haccp`;
        // 업소명 검색 시 -> search api / 검색하지 않을 시 조회 api 호출
        if (businessName) {
            apiUrl += `/search/findByBusinessNameContainingIgnoreCase?businessName=${businessName}&page=${page}&size=${size}`;
        } else {
            apiUrl += `?page=${page}&size=${size}&sort=createdDate,desc`;
        }
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    "Authorization": token
                }
            });
            const data = response.data;
            setHaccpList(data._embedded.haccpInfoes || []);
            // 전체 게시글 수
            setTotalElements(data.page.totalElements);
            // 전체 페이지 수
            const totalPagesCalculated = Math.ceil(data.page.totalElements / size);
            setTotalPages(totalPagesCalculated);
            setLoading(false);
        } catch (error) {
            console.error("데이터 불러오기 오류: ", error);
            setError(error);
            setHaccpList([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, businessName, token]);

    useEffect(() => {
        fetchHaccpData();
    }, [currentPage, pageSize, businessName, fetchHaccpData]);

    // 페이지 번호 변경
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setSelectedHaccps([]); // 페이지가 바뀌면 선택된 항목 초기화
    };

    // 페이지 크기 변경 처리 함수
    const handlePageSizeChange = (e) => {
        const newPageSize = Number(e.target.value);
        setPageSize(newPageSize);
        // 새로운 최대 페이지 계산
        const newTotalPages = Math.ceil(totalElements / newPageSize);
        setTotalPages(newTotalPages);
        // 현재 페이지가 새로 계산된 페이지 범위 내에 있는 지 확인
        const newCurrentPage = currentPage > newTotalPages ? newTotalPages : currentPage;
        // 페이지 번호를 업데이트하고, 해당 페이지의 데이터 로드
        setCurrentPage(newCurrentPage);
        // 새 페이지와 크기로 데이터 로드
        fetchHaccpData(newCurrentPage, newPageSize);
        // 페이지 크기가 변경되면 선택된 항목 초기화
        setSelectedHaccps([]);
        // 페이지 크기가 변경되면 1페이지로 이동
        setCurrentPage(1);
    };

    // 페이지가 비어있으면 이전 페이지로 자동 이동     
    const handleAdjustPage = useCallback(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
        } else {
            fetchHaccpData(currentPage - 1, pageSize);
        }
    }, [currentPage, totalPages, fetchHaccpData, pageSize]);

    useEffect(() => {
        handleAdjustPage();
    }, [handleAdjustPage]);

    // currentPage가 변경되면 선택 상태 초기화
    useEffect(() => {
        setIsAllSelected(false);
        setSelectedHaccps([]);
    }, [currentPage]);

    const handleSearch = () => {
        fetchHaccpData(businessName); // 필터 조건을 포함하여 데이터를 요청
    }

    // 데이터 단건 삭제
    const handleDelete = (haccpId) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        fetch(`${SERVER_URL}haccp/${haccpId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token,
            }
        })
            .then((response) => {
                if (response.ok) {
                    handleAdjustPage(); // 삭제 후 페이지 조정
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setHaccpList(
                    haccpList.filter(
                        (haccp) =>
                            haccp._links.self.href.split("/").pop() !== haccpId
                    )
                );
                alert("삭제되었습니다.");
            })
            .catch((error) => {
                console.error("삭제 오류:", error);
                alert("삭제 중 오류가 발생했습니다.");
            });
    };

    // 수정 페이지
    const handleEditClick = (haccpId) => {
        navigate(`/ingredientInfo/haccp-info/edit/${haccpId}`);
    }

    // 단일 데이터 추가
    const handleWriteClick = () => {
        navigate(`/ingredientInfo/haccp-info/write`);
    }

    // 대용량 데이터 업로드
    const handleUploadClick = () => {
        navigate("/ingredientInfo/haccp-info/write-file-upload");

    }
    // 선택된 항목 토글 함수
    const toggleSelectHaccp = (haccpId) => {
        setSelectedHaccps((prevSelectedHaccps) =>
            prevSelectedHaccps.includes(haccpId)
                //이미 선택된 항목이면 해제 
                ? prevSelectedHaccps.filter((id) => id !== haccpId)
                //선택되지 않은 항목이면 추가
                : [...prevSelectedHaccps, haccpId]
        );
    };


    // 전체 선택/해제 처리
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedHaccps([]);
        } else {
            const allHaccps = haccpList.map((haccp) => haccp._links.self.href.split("/").pop()); // 전체 haccpId 가져오기
            setSelectedHaccps(allHaccps); // 모든 항목을 선택
        }
        setIsAllSelected(!isAllSelected);
    }

    // 선택된 항목들을 다운로드(모든 권한)
    const downloadSelectedHaccps = () => {
        // 선택된 정보만 필터링
        const selectedData = haccpList.filter(haccp => selectedHaccps.includes(haccp._links.self.href.split("/").pop()));

        // 원하는 필드만 추출
        const filteredData = selectedData.map(haccp => ({
            haccpDesignationNumber: haccp.haccpDesignationNumber,  //지정번호
            category: haccp.category,                              // 카테고리
            businessName: haccp.businessName,                      // 업소명
            address: haccp.address,                                // 주소
            productName: haccp.productName,                        // 품목명
            businessStatus: haccp.businessStatus,                  // 영업상태
            certificationEndDate: haccp.certificationEndDate,      // 인증종료일자
        }));

        // JSON -> 엑셀 형식으로 변환
        const workSheet = XLSX.utils.json_to_sheet(filteredData, { header: [] });

        // 사용자 정의 헤더 추가 (첫 번째 행에)
        const customHeader = ['HACCP 지정번호', '카테고리', '업소명', '주소', '품목명', '영업상태', '인증종료일자']; // 여기에 원하는 헤더를 설정
        workSheet['!cols'] = customHeader.map(() => ({ width: 20 })); // 컬럼 너비 설정
        XLSX.utils.sheet_add_aoa(workSheet, [customHeader], { origin: 'A1' });
        // 워크북 생성
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'HaccpData');

        // 엑셀 파일 다운로드
        XLSX.writeFile(workBook, 'selected_haccps.xlsx');
    }

    // 선택된 항목 삭제(관리자 권한)
    const handleDeleteSelected = () => {
        if (!window.confirm("선택된 항목들을 삭제하시겠습니까?")) return;

        // 모든 삭제 요청을 Promise 배열로 만들기
        const deletePromises = selectedHaccps.map((haccpId) =>
            fetch(`${SERVER_URL}haccp/${haccpId}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    // 성공적인 삭제 후 목록에서 해당 항목 제거
                    setHaccpList((prevList) =>
                        prevList.filter(
                            (haccp) => haccp._links.self.href.split("/").pop() !== haccpId
                        )
                    );
                    handleAdjustPage();
                })
        );
        // 모든 삭제 요청이 완료될 때까지 기다리기
        Promise.all(deletePromises)
            .then(() => {
                setSelectedHaccps([]); // 삭제 후 선택된 항목 초기화
                alert("선택한 항목이 삭제되었습니다."); // 한 번만 알림 띄우기
                setIsAllSelected(false); // 선택 토글 해제
                fetchHaccpData(currentPage - 1, pageSize);
            })
            .catch(() => {
                alert("삭제 중 오류가 발생했습니다.");  // 한 번만 오류 알림
            });
    };

    // 전체 게시글 번호 계산 함수
    const calculateTotalNumber = (index) => {
        return totalElements - ((currentPage - 1) * pageSize + index);    // 페이지가 1부터 시작하도록 수정
    };
    return (
        <div className="ingredient-info-list-container">
            <h1 className="ingredient-info-title">HACCP 인증 정보</h1>

            {/* 데이터 관리 버튼 목록 - 관리자, 담당자 에게만 보이도록 */}
            {(isAdmin || isBoardAdmin) && (
                <div className="ingredient-info-button-group">
                    <Button variant="outlined" color="primary" onClick={handleWriteClick}>
                        단일 데이터 추가
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleUploadClick}>
                        대용량 데이터 업로드
                    </Button>

                    {/* 선택된 항목 삭제 버튼 */}
                    <div className="ingredient-info-delete-selected">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteSelected}
                            disabled={selectedHaccps.length === 0} // 선택된 항목이 없으면 비활성화
                        >
                            선택된 항목 삭제
                        </Button>
                    </div>
                </div>
            )}

            <div>
                {/* 전체 선택메뉴, 다운로드메뉴 - 모든 권한 가능 */}
                <div className="ingredient-info-button-group">
                    <Button variant={isAllSelected ? 'outlined' : 'contained'}
                        color={isAllSelected ? 'warning' : 'warning'}
                        onClick={handleSelectAll}
                    >
                        {isAllSelected ? '전체 해제' : '전체 선택'}
                    </Button>
                    <Button variant="contained" color="success" onClick={downloadSelectedHaccps}>
                        선택 항목 다운로드
                    </Button>
                </div>
                <div>
                </div>
                {/* 페이지 당 게시글 수 선택기 */}
                <div className="ingredient-paging-selector">
                    <div className='ingredient-info-page-selector'>
                        <label>페이지 당 게시글 수: </label>
                        <Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            <MenuItem value={5}>5개</MenuItem>
                            <MenuItem value={10}>10개</MenuItem>
                            <MenuItem value={20}>20개</MenuItem>
                        </Select>
                    </div>
                    {/*검색 창*/}
                    <div className='search-container'>
                        <TextField
                            label="업소명 검색"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            className="ingredient-filter-textfield"
                        />
                        {/* 검색 버튼 */}
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            검색
                        </Button>
                    </div>
                </div>
            </div>

            {/* 로딩중 표시 */}
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center', // 수평 가운데 정렬
                    alignItems: 'center', // 수직 가운데 정렬
                    height: '30vh' // 전체 화면 높이
                }}>
                    <CircularProgress />
                    <br />
                    <p>데이터를 불러오는 중입니다....⏰</p>
                </div>
            ) : (
                //데이터가 없을 경우
                haccpList.length === 0 ? (
                    <div>
                        <p>등록된 정보가 없습니다.</p>
                    </div>
                ) : (
                    <div className='haccp-info'>
                        <table className="ingredient-info-table">
                            <thead className="ingredient-info-thead">
                                <tr>
                                    <th>선택</th>
                                    <th>번호</th>
                                    <th>HACCP 지정번호</th>
                                    <th>카테고리</th>
                                    <th>업소명</th>
                                    <th>주소</th>
                                    <th>품목명</th>
                                    <th>영업상태</th>
                                    <th>인증종료일자</th>

                                    {/* 관리자, 담당자:수정, 삭제   그 외: 비고 */}
                                    {(isAdmin || isBoardAdmin) ?
                                        (<>
                                            <th>수정</th>
                                            <th>삭제</th>
                                        </>
                                        ) : (
                                            <th>비고</th>
                                        )}
                                </tr>
                            </thead>

                            <tbody className="ingredient-info-tbody">
                                {haccpList.map((haccp, index) => {
                                    const haccpId = haccp._links.self.href.split("/").pop(); // ID 추출
                                    return (
                                        <tr key={haccpId}>

                                            {/* 체크박스 */}
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedHaccps.includes(haccpId)}
                                                    onChange={() => toggleSelectHaccp(haccpId)}
                                                />
                                            </td>

                                            <td>{calculateTotalNumber(index)}</td>
                                            <td>{haccp.haccpDesignationNumber}</td>
                                            <td>{haccp.category}</td>
                                            <td>{haccp.businessName}</td>
                                            <td>{haccp.address}</td>
                                            <td>{haccp.productName}</td>
                                            <td>{haccp.businessStatus}</td>
                                            <td>{haccp.certificationEndDate}</td>

                                            {/* 관리자,담당자: 수정, 삭제    그 외: 공란 */}
                                            {(isAdmin || isBoardAdmin) ? (
                                                <>
                                                    {/* 수정 */}
                                                    <td>
                                                        <IconButton color="primary"
                                                            onClick={() => handleEditClick(haccpId)}
                                                            size="small" >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </td>
                                                    {/* 삭제 */}
                                                    <td>
                                                        <IconButton color="error"
                                                            onClick={() => handleDelete(haccpId)}
                                                            size="small">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </td>
                                                </>
                                            ) : (
                                                <td> {/* 비고란 */} </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            <br />
            {/* 페이지네이션 버튼 */}
            <div className="pagination-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Pagination
                    count={totalPages} // 전체 페이지 수
                    page={currentPage} // 현재 페이지
                    onChange={handlePageChange} // 페이지 변경 이벤트 핸들러
                    color="primary"
                    variant="outlined"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: '50%', // 둥근 버튼
                            border: '1px solid #e0e0e0', // 연한 테두리
                            backgroundColor: '#fff', // 기본 배경색
                            '&:hover': {
                                backgroundColor: '#52a8ff', // 호버 시 배경색
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#1976d2', // 선택된 페이지 배경
                                color: '#fff', // 선택된 페이지 글자 색
                            },
                        },
                        '& .MuiPaginationItem-previousNext': {
                            fontSize: '20px', // 이전/다음 아이콘 크기
                            padding: '5px', // 간격
                        },
                        '& .MuiPaginationItem-first, & .MuiPaginationItem-last': {
                            fontSize: '20px', // 첫/마지막 아이콘 크기
                        },
                    }}
                />
            </div>
        </div >
    );
};

export default HaccpInfoList;