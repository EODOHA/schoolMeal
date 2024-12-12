import React, { useCallback, useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner";
import { Button, IconButton, Pagination } from "@mui/material";
import '../../../css/ingredientInfo/IngredientInfoList.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const HaccpInfoList = () => {
    const [haccpList, setHaccpList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHaccps, setSelectedHaccps] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    //페이지네이션 관련 상태
    const [currentPage, setCurrentPage] = useState(1); //현재 페이지 1부터 시작
    const [totalPages, setTotalPages] = useState(); //전체 페이지 수(임베디드데이터 이름)
    const [pageSize, setPageSize] = useState(5); // 페이지 당 게시글 수(임베디드데이터이름: size)
    const [totalElements, setTotalElements] = useState(); // 전체 게시글 수(임베디드데이터 이름)


    // 데이터 목록 가져오기 -> 페이지와 크기 파라미터를 추가하여 전체 페이지 수 설정
    const fetchHaccpData = useCallback((page = currentPage - 1, size = pageSize) => {
        setLoading(true)
        fetch(`${SERVER_URL}haccp?page=${page}&size=${size}&sort=createdDate,desc`)   //생성일, 내림차순으로 불러옴
            .then((response) => response.json())
            .then((data) => {
                setHaccpList(data._embedded.haccpInfoes || []);
                setTotalElements(data.page.totalElements); //전체 게시글 수 설정
                const totalPagesCalculated = Math.ceil(data.page.totalElements / size);
                setTotalPages(totalPagesCalculated); // 전체 페이지 수 재계산
                setLoading(false);
                // console.log("totalPages:", totalPages);  // 전체 페이지 수
                // console.log("totalElements:", totalElements);  // 전체 게시글 수
                // console.log("pageSize:", pageSize);  // 페이지 당 항목 수
            })
            .catch((error) => {
                console.error("Error fetching HACCP data:", error);
                setHaccpList([]); // 오류 발생 시 빈 배열로 초기화
            })
            .finally(() => {
                setLoading(false); // 데이터 요청 완료 시 로딩 상태 해제
            });
    }, [pageSize]);

    // 페이지나 변경 시 데이터 요청
    useEffect(() => {
        fetchHaccpData();
    }, [fetchHaccpData]);

    // 개별 삭제 버튼 클릭 시
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
                    //삭제 성공 후, 데이터를 다시 로드
                    fetchHaccpData(currentPage);
                    checkAndAdjustPage(); // 삭제 후 페이지 조정
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

    // 삭제 후 페이지가 비어있으면 이전 페이지로 자동 이동     
    const checkAndAdjustPage = () => {
        // 현재 페이지에 남은 게시글이 없다면
        if (haccpList.length === 0 && currentPage > 0) {
            setCurrentPage(currentPage - 1);//이전페이지로 이동
        }
    }

    //페이지 번호 변경
    const handlePageChange = (event, value) => {
        setCurrentPage(value); // 현재 페이지 1부터 설정
        fetchHaccpData(value-1, pageSize); // 해당 페이지 새 데이터요청
    }

    //수정 페이지로 이동
    const handleEditClick = (haccpId) => {
        navigate(`/ingredientInfo/haccp-info/edit/${haccpId}`);
    }

    const handleWriteClick = () => {
        navigate(`/haccp-info/write`);
    }

    // 데이터 업로드 페이지로 이동
    const handleUploadClick = () => {
        navigate("/haccp-info/write-file-upload");

    }
    // 선택된 항목 토글 함수
    const toggleSelectHaccp = (haccpId) => {
        setSelectedHaccps((prevSelectedHaccps) =>
            prevSelectedHaccps.includes(haccpId)
                ? prevSelectedHaccps.filter((id) => id !== haccpId) //이미 선택된 항목이면 해제
                : [...prevSelectedHaccps, haccpId]  //선택되지 않은 항목이면 추가
        );
    };
    // 전체 게시글 번호 계산 함수
    const calculateTotalNumber = (index) => {
        return totalElements - ((currentPage - 1) * pageSize + index);    // 페이지가 1부터 시작하도록 수정
    };

    // 선택된 항목 삭제
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
                })
                .catch((error) => {
                    console.error("삭제 오류:", error);
                    throw new Error("삭제 중 오류가 발생했습니다."); // 오류를 처리하고 메시지를 던짐
                })
        );

        // 모든 삭제 요청이 완료될 때까지 기다리기
        Promise.all(deletePromises)
            .then(() => {
                setSelectedHaccps([]); // 삭제 후 선택된 항목 초기화
                fetchHaccpData();
                alert("삭제가 완료되었습니다."); // 한 번만 알림 띄우기
            })
            .catch(() => {
                alert("삭제 중 오류가 발생했습니다.");  // 한 번만 오류 알림
            });
    };
    if (loading) {
        return <div><LoadingSpinner /></div>;
    }
    return (
        <div className="ingredient-info-list-container">
            <h1 className="ingredient-info-title">HACCP 인증 정보</h1>
            {/* 페이징 선택기 */}
            <div className="ingredient-paging-selector">
                <label>페이지 당 게시글 수: </label>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value)); //페이지 크기 업데이트
                        fetchHaccpData(1, Number(e.target.value)); // 첫페이지부터 다시 로드
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <div className="ingredient-info-button-group">
                <Button variant="contained" color="primary" onClick={handleWriteClick}>
                    단일 데이터 추가
                </Button>
                <Button variant="contained" color="secondary" onClick={handleUploadClick}>
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
            {haccpList.length === 0 ? (
                <div>
                    <p>등록된 HACCP 인증 정보가 없습니다.</p>
                </div>
            ) : (
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
                            <th>수정</th>
                            <th>삭제</th>
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
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <br></br>
            {/* 페이지네이션 버튼 추가 */}
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
        </div>
    );
};

export default HaccpInfoList;