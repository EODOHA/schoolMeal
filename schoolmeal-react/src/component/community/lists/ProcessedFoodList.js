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
import "../../../css/community/ProcessedFoodList.css";

const ProcessedFoodList = () => {

  const [processedFood, setProcessedFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProcessedFood, setSelectedProcessedFood] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false); // 전체 선택 여부
  const { token, isAdmin, isBoardAdmin } = useAuth();
  const navigate = useNavigate();

  // ------------------------ 페이지네이션 관련 설정
  const [currentPage, setCurrentPage] = useState(1);       // 현재 페이지 1부터 시작
  const [totalPages, setTotalPages] = useState();          // 전체 페이지 수(임베디드데이터 이름)
  const [pageSize, setPageSize] = useState(10);             // 페이지 당 게시글 수(임베디드데이터이름: size)
  const [totalElements, setTotalElements] = useState();    // 전체 게시글 수(임베디드데이터 이름)

  // ------------------------ 검색 관련 설정
  const [productName, setProductName] = useState(""); // 품목명 검색


  // 데이터 목록 가져오기 -> 페이지와 크기 파라미터를 추가하여 전체 페이지 수 설정
  const fetchProcessedFoods = useCallback(async (page = currentPage - 1, size = pageSize) => {
    setLoading(true);
    // 기본값
    let apiUrl = `${SERVER_URL}processedFood`;
    // 업소명 검색 시 -> search api / 검색하지 않을 시 조회 api 호출
    if (productName) {
      apiUrl += `/search/findByProductNameContainingIgnoreCase?productName=${productName}&page=${page}&size=${size}`;
    } else {
      apiUrl += `?page=${page}&size=${size}&sort=createdDate,desc`;
    }
    // API URL 로그 출력
    // console.log("API URL:", apiUrl);
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Authorization": token
        }
      });
      const data = response.data;
      setProcessedFood(data._embedded.processedFoods || []);
      // 전체 게시글 수
      setTotalElements(data.page.totalElements);

      // 전체 페이지 수
      const totalPagesCalculated = Math.ceil(data.page.totalElements / size);
      setTotalPages(totalPagesCalculated);

    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
      setError(error);
      setProcessedFood([]);
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, productName, token]);

  useEffect(() => {
    fetchProcessedFoods();
  }, [currentPage, pageSize, productName, fetchProcessedFoods]);

  // 페이지 번호 변경
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setSelectedProcessedFood([]); // 페이지가 바뀌면 선택된 항목 초기화
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
    setCurrentPage(newCurrentPage);
    // 새 페이지와 크기로 데이터 로드
    fetchProcessedFoods(newCurrentPage, newPageSize);
    // 페이지가 변경되면 선택된 항목 초기화
    setSelectedProcessedFood([]);
    // 페이지가 변경되면 1페이지로 이동
    setCurrentPage(1);
  };
  // 페이지가 비어있으면 이전 페이지로 자동 이동     
  const handleAdjustPage = useCallback(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    } else {
      fetchProcessedFoods(currentPage - 1, pageSize);
    }
  }, [currentPage, totalPages, fetchProcessedFoods, pageSize]);

  useEffect(() => {
    handleAdjustPage();
  }, [handleAdjustPage]);

  // currentPage가 변경되면 선택 상태 초기화
  useEffect(() => {
    setIsAllSelected(false);
    setSelectedProcessedFood([]);
  }, [currentPage]);

  const handleSearch = () => {
    fetchProcessedFoods(productName); // 필터 조건을 포함하여 데이터를 요청
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return (
      <>
        {`${year}-${month}-${day}`}
      </>
    );
  };

  // 데이터 단건 삭제
  const handleDelete = (processedFoodId) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    fetch(`${SERVER_URL}processedFood/${processedFoodId}`, {
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
        setProcessedFood(
          processedFood.filter(
            (processedFood) =>
              processedFood._links.self.href.split("/").pop() !== processedFoodId
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
  const handleEditClick = (processedFoodId) => {
    navigate(`/community/processedFood/edit/${processedFoodId}`);
  }

  // 단일 데이터 추가
  const handleWriteClick = () => {
    navigate(`/community/processedFood/write`);
  }

  // 대용량 데이터 업로드
  const handleUploadClick = () => {
    navigate("/community/processedFood/write-file-upload");

  }
  // 선택된 항목 토글 함수
  const toggleSelectProcessedFood = (processedFoodId) => {
    setSelectedProcessedFood((prevSelectedProcessedFood) =>
      prevSelectedProcessedFood.includes(processedFoodId)
        //이미 선택된 항목이면 해제 
        ? prevSelectedProcessedFood.filter((id) => id !== processedFoodId)
        //선택되지 않은 항목이면 추가
        : [...prevSelectedProcessedFood, processedFoodId]
    );
  };

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedProcessedFood([]);
    } else {
      const allProcessedFood = processedFood.map((processedFood) => processedFood._links.self.href.split("/").pop()); // 전체 processedFoodId 가져오기
      setSelectedProcessedFood(allProcessedFood); // 모든 항목을 선택
    }
    setIsAllSelected(!isAllSelected);
  }

  // 선택된 항목들을 다운로드(모든 권한)
  const downloadSelectedProcessedFood = () => {
    // 선택된 정보만 필터링
    const selectedData = processedFood.filter(processedFood => selectedProcessedFood.includes(processedFood._links.self.href.split("/").pop()));

    // 원하는 필드만 추출
    const filteredData = selectedData.map(processedFood => ({
      productName: processedFood.productName,
      price: processedFood.price,
      consumerPrice: processedFood.consumerPrice,
      companyName: processedFood.companyName,
      addressLink: processedFood.addressLink,
      entryDate: processedFood.createdDate
    }));

    // JSON -> 엑셀 형식으로 변환
    const workSheet = XLSX.utils.json_to_sheet(filteredData, { header: [] });

    // 사용자 정의 헤더 추가 (첫 번째 행에)
    const customHeader = ['품목명', '가격', '소비자가격', '회사명', '회사 링크', '등록일자'];
    workSheet['!cols'] = customHeader.map(() => ({ width: 20 })); // 컬럼 너비 설정
    XLSX.utils.sheet_add_aoa(workSheet, [customHeader], { origin: 'A1' });
    // 워크북 생성
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'ProcessedFood');

    // 엑셀 파일 다운로드
    XLSX.writeFile(workBook, 'selected_processed_food.xlsx');

  }
  // 선택된 항목 삭제(관리자 권한)
  const handleDeleteSelected = () => {
    if (!window.confirm("선택된 항목들을 삭제하시겠습니까?")) return;

    // 모든 삭제 요청을 Promise 배열로 만들기
    const deletePromises = selectedProcessedFood.map((processedFoodId) =>
      fetch(`${SERVER_URL}processedFood/${processedFoodId}`, {
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
          setProcessedFood((prevList) =>
            prevList.filter(
              (processedFood) => processedFood._links.self.href.split("/").pop() !== processedFoodId
            )
          );
          handleAdjustPage();
        })
    );

    // 모든 삭제 요청이 완료될 때까지 기다리기
    Promise.all(deletePromises)
      .then(() => {
        setSelectedProcessedFood([]); // 삭제 후 선택된 항목 초기화
        alert("삭제가 완료되었습니다."); // 한 번만 알림 띄우기
        setIsAllSelected(false); // 선택 토글 해제
        fetchProcessedFoods(currentPage - 1, pageSize);
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
    <div className="processed-food-list-container">
      <h1 className="processed-food-title">가공식품정보</h1>


      {/* 데이터 관리 버튼 목록 - 관리자와 담당자에게만 보이도록 */}
      {(isAdmin || isBoardAdmin) && (
        <div className="processed-food-button-group">
          <Button variant="outlined" color="primary" onClick={handleWriteClick}>
            단일 데이터 추가
          </Button>
          <Button variant="contained" color="primary" onClick={handleUploadClick}>
            대용량 데이터 업로드
          </Button>

          {/* 선택된 항목 삭제 버튼 */}
          <div className="processed-food-delete-selected">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              disabled={selectedProcessedFood.length === 0} // 선택된 항목이 없으면 비활성화
            >
              선택된 항목 삭제
            </Button>
          </div>
        </div>
      )}

      <div>
        {/* 전체 선택메뉴, 다운로드메뉴 - 모든 권한 가능 */}
        <div className="processed-food-button-group">
          <Button variant={isAllSelected ? 'outlined' : 'contained'}
            color={isAllSelected ? 'warning' : 'warning'}
            onClick={handleSelectAll}
          >
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </Button>
          <Button variant="contained" color="success" onClick={downloadSelectedProcessedFood}>
            선택 항목 다운로드
          </Button>
        </div>
        <div>
        </div>
        {/* 페이지 당 게시글 수 선택기 */}
        <div className="processed-food-paging-selector">
          <div className='processed-food-page-selector'>
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
              label="품목명 검색"
              value={productName}

              onChange={(e) => setProductName(e.target.value)}
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
              className="processed-food-filter-textfield"
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
        processedFood.length === 0 ? (
          <div>
            <p>등록된 정보가 없습니다.</p>
          </div>
        ) : (
          <div className='processed-food-price'>
            <table className="processed-food-table">
              <thead className="processed-food-thead">
                <tr>
                  <th>선택</th>
                  <th>번호</th>
                  <th>품목명</th>
                  <th>가격</th>
                  <th>소비자가격</th>
                  <th>회사명</th>
                  <th>회사 링크</th>
                  <th>설명</th>
                  <th>등록일자</th>

                  {/* 관리자와 담당자 :수정, 삭제   그 외: 비고 */}
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

              <tbody className="processed-food-tbody">
                {processedFood.map((processedFood, index) => {
                  const processedFoodId = processedFood._links.self.href.split("/").pop(); // ID 추출
                  return (
                    <tr key={processedFoodId}>

                      {/* 체크박스 */}
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProcessedFood.includes(processedFoodId)}
                          onChange={() => toggleSelectProcessedFood(processedFoodId)}
                        />
                      </td>

                      <td>{calculateTotalNumber(index)}</td>
                      <td>{processedFood.productName}</td>
                      <td>{processedFood.price}</td>
                      <td>{processedFood.consumerPrice}</td>
                      <td>{processedFood.companyName}</td>
                      <td>{processedFood.addressLink}</td>
                      <td>{processedFood.description}</td>
                      <td>{formatDate(processedFood.createdDate)}</td>

                      {/* 관리자와 담당자: 수정, 삭제    그 외: 공란 */}
                      {(isAdmin || isBoardAdmin) ? (
                        <>
                          {/* 수정 */}
                          <td>
                            <IconButton color="primary"
                              onClick={() => handleEditClick(processedFoodId)}
                              size="small" >
                              <EditIcon />
                            </IconButton>
                          </td>
                          {/* 삭제 */}
                          <td>
                            <IconButton color="error"
                              onClick={() => handleDelete(processedFoodId)}
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

export default ProcessedFoodList;