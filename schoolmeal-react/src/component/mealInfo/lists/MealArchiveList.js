import '../../../css/mealInfo/MealInfoList.css';
import React, { useEffect, useState } from 'react';
import MealArchiveWrite from '../writes/MealArchiveWrite';
import SearchBar from '../../common/SearchBar';     // 검색창 컴포넌트 임포트
import axios from 'axios';
import { SERVER_URL } from '../../../Constants';
import { Button } from '@mui/material';
import { MdAttachFile } from "react-icons/md";
import { BsFileExcel } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../sign/AuthContext';


function MealArchiveList() {
    const [archives, setArchives] = useState([]); // 전체 게시글 데이터
    const [isWriting, setIsWriting] = useState(false); // 새 글 작성 여부 상태 관리
    const [error, setError] = useState(null);
    const [setSelectedId] = useState(null);  //선택된 게시글의 ID 저장 상태
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

    // 검색창, 필터 버튼을 위한 설정
    const [selectedFilter, setSelectedFilter] = useState('전체') // 필터 상태 추가 
    const [searchQuery, setSearchQuery] = useState('') // 검색어 상태 추가

    // 게시판 권한 설정 - AuthContext에서 token과 isAdmin을 가져옴
    const { token, isAdmin, isBoardAdmin } = useAuth();

    // ------------------------------------------------- 페이지네이션  ------------------------------------------------- //
    const [currentPage, setCurrentPage] = useState(1);  //현재 페이지 상태(기본값:1)
    const [postsPerPage] = useState(5); // 페이지당 게시글 수
    const [pageNumbersPerBlock] = useState(4) // 한 블록당 표시할 페이지 번호 수

    const totalPages = Math.ceil(archives.length / postsPerPage); //전체 페이지 수
    const totalBlocks = Math.ceil(totalPages / pageNumbersPerBlock); // 전체 블록수
    const currentBlock = Math.ceil(currentPage / pageNumbersPerBlock); // 현재 블록 번호
    const startPage = (currentBlock - 1) * pageNumbersPerBlock + 1; //현재 블록의 첫 페이지 번호
    const endPage = Math.min(startPage + pageNumbersPerBlock - 1, totalPages);  //현재 블록의 마지막 페이지번호(전체 페이지 수를 넘지 않도록)

    // 현재 페이지에 맞는 게시글 추출
    const currentPosts = archives.slice() // 원본 배열을 복사
        .filter(item => {
            if (selectedFilter === "제목") {
                return item.title.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (selectedFilter === "작성자") {
                return item.arc_author.toLowerCase().includes(searchQuery.toLowerCase());
            } else {
                return (
                    item.arc_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.arc_author.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
        })
        // } else if (selectedFilter === "내용") {
        //     return item.arc_content.toLowerCase().includes(searchQuery.toLowerCase());
        //     item.arc_content.toLowerCase().includes(searchQuery.toLocaleLowerCase())
        .reverse() //게시글을 최신 순으로 정렬
        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage); // 현재 페이지에 맞는 게시글만 슬라이싱

    // 특정 페이지 번호 클릭 시 해당 페이지로 이동
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동
    const handlePrevBlock = () => {
        if (currentBlock > 1) {
            setCurrentPage(startPage - 1);
        } else {
            setCurrentPage(currentPage - 1);
        }
    }

    // 다음 페이지으로 이동
    const handleNextBlock = () => {
        if (currentBlock < totalBlocks) {
            setCurrentPage(endPage + 1);
        } else {
            setCurrentPage(currentPage + 1);
        }
    };
    // ------------------------------------------------- 페이지네이션  끝 ------------------------------------------------- //

    // 새 글 쓰기 버튼 클릭 시 상태 변경
    const handleNewPostClick = () => {
        setIsWriting(true);
    }

    // 새 글 이전 목록으로 돌아오고자 하는 경우 isWriting 상태를 false로 설정하여 목록으로 돌아오기
    const handleBackToList = () => {
        setIsWriting(false);
    };

    //새 글 저장 함수
    const writeArchive = (newArchive, file) => {
        const formData = new FormData();
        formData.append('arc_title', newArchive.arc_title);
        formData.append('arc_content', newArchive.arc_content);
        formData.append('arc_author', newArchive.arc_author);

        if (file) {
            formData.append('file', file); //첨부파일이 존재하면 formData에 추가
        }

        axios.post(`${SERVER_URL}mealArchive`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token //토큰 추가
            },
        })
            .then(response => {
                // console.log("새 글 저장 성공:", response.data);
                setArchives([...archives, response.data]); //새 글 추가
                alert("새 글 작성이 완료되었습니다.");

                setIsWriting(false); // 작성 완료 후 작성 폼 닫기
            })
            .catch(error => {
                console.error("새 글 저장 실패", error);
                setError("게시판 등록 중 문제가 발생했습니다. 다시 시도해 주세요");
            });
    };

    // 상세페이지로 전환
    const gotoDetailArchive = (id) => {
        setSelectedId(id); //선택된 게시글의 id 저장
        // console.log("선택된 id:", id);
        navigate(`/mealInfo/meal-archive/${id}`);  // 상대 경로로 상세 페이지 이동
    }

    // 게시글 목록 불러오기
    useEffect(() => {
        axios.get(`${SERVER_URL}mealArchive`)
            .then(response => {
                // console.log("불러온 archive 데이터 : ", response.data);
                setArchives(response.data);
            })
            .catch(error => {
                console.error("데이터 로드 실패", error);
            });
    }, []);

    // 날짜 변환
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return (
            <>
                {`${year}년 ${month}월 ${day}일`}<br />
                {`${hours}:${minutes}:${seconds}`}
            </>
        );
    };

    return (
        <div className='meal-info-list'>
            {isWriting ? (
                <MealArchiveWrite writeArchive={writeArchive} handleBackToList={handleBackToList} // handleBackToList를 props로 전달
                    error={<div className='meal-info-error-message'>{error}</div>} /> //isWriting 이 true일 떄 MealArchiveWrite 컴포넌트를 렌더링
            ) : (
                <div className="meal-info-list-container">
                    <h1 className='meal-info-title'>학교 급식 과거와 현재</h1>
                    <div className='meal-info-list-button-group'>
                        {/* isAdmin또는 isBoardAdmin이 true일 때만 새 글 쓰기 버튼 표시 */}
                        {(isAdmin || isBoardAdmin) && (
                            <div className='meal-info-list-write-button'>
                                {/* 새 글 쓰기 버튼을 누르면 isWriting을 true로 세팅 -> MealArchiveWrite 컴포넌트 렌더링 */}
                                < Button variant='outlined' onClick={handleNewPostClick}>새 글 쓰기</Button>
                            </div>
                        )}
                        {/* 검색창 */}
                        <div className='meal-info-right-searchbar'>
                            <SearchBar
                                searchQuery={searchQuery}
                                selectedFilter={selectedFilter}
                                setSelectedFilter={setSelectedFilter}
                                setSearchQuery={setSearchQuery}
                                onFilterChange={(filterType, filterValue) => {
                                    setSelectedFilter(filterType);
                                    setSearchQuery(filterValue);
                                }}
                            />
                        </div>
                    </div>

                    <table className='meal-info-table'>
                        <thead className='meal-info-thead'>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>등록일</th>
                                <th>작성자</th>
                                <th>첨부파일</th>
                            </tr>
                        </thead>
                        <tbody className='meal-info-tbody'>
                            {(archives && archives.length === 0) ? (
                                <tr>
                                    <td colSpan="5">데이터가 없습니다.</td>
                                </tr>
                            ) : (

                                currentPosts.map((archive, index) => {
                                    // 게시글의 번호를 역순으로 계산 
                                    const postNumber = archives.length - (currentPage - 1) * postsPerPage - index;
                                    return (
                                        <tr key={archive.arc_id} onClick={() => gotoDetailArchive(archive.arc_id)}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        >
                                            <td>{postNumber}</td>
                                            <td>{archive.arc_title}</td>
                                            <td>{formatDate(archive.createdDate)}</td>
                                            <td>{archive.arc_author}</td>
                                            <td>
                                                {archive.arc_files && archive.arc_files.length > 0 ? (
                                                    archive.arc_files.map(file => {
                                                        const encodedFilename = encodeURIComponent(file.arc_storedFilename);
                                                        const fileUrl = `${SERVER_URL}mealArchive/download/${encodedFilename}`;
                                                        return (
                                                            <div key={file.arc_file_id}>
                                                                <a href={fileUrl} download>
                                                                    <span className="meal-info-attachment-icon"><MdAttachFile /></span>
                                                                    {/* {file.arc_originalFilename} */}
                                                                </a>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="meal-info-attachment-icon"><BsFileExcel /></span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    {/* 페이지네이션 버튼 */}
                    <div className="pagination">
                        <Button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{"<<"}</Button>
                        <Button onClick={handlePrevBlock} disabled={currentPage === 1}>{"<"}</Button>
                        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
                            <Button
                                key={startPage + idx}
                                onClick={() => handlePageClick(startPage + idx)}
                                variant={currentPage === startPage + idx ? "contained" : "outlined"}
                            >
                                {startPage + idx}
                            </Button>
                        ))}
                        <Button onClick={handleNextBlock} disabled={currentPage === totalPages}>{">"}</Button>
                        <Button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{">>"}</Button>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default MealArchiveList;