import React, { useState, useEffect } from 'react';
import { SERVER_URL } from "../../../../Constants";
import { useAuth } from '../../../sign/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../../css/mainManage/AdminNoticeManagerList.css';
import Button from "@mui/material/Button";
import { MdAttachFile } from "react-icons/md";
import Pagination from '@mui/material/Pagination';

const AdminNoticeManagerList = () => {
    const [notices, setNotices] = useState([]);
    const { token,isAdmin } = useAuth();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetch(SERVER_URL + 'adminNotice', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            const sortedNotices = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setNotices(sortedNotices);
        })
    }, [token]);

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

    const handleRowClick = (id) => {
        navigate(`/adminNoticeManager/detail/${id}`);
    }

    const handleEditClick = (e, id) => {
        e.stopPropagation(); // 클릭 이벤트가 row로 전파되지 않도록 방지
        navigate(`/adminNoticeManager/edit/${id}`); // 수정 페이지로 이동
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation(); // 클릭 이벤트가 row로 전파되지 않도록 방지
        if (window.confirm("정말 삭제하시겠습니까?")) {
            fetch(`${SERVER_URL}adminNotice/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            })
            .then(() => {
                alert("삭제되었습니다.");
                setNotices(notices.filter((notice) => notice.id !== id)); // 삭제 후 리스트에서 제거
            })
            .catch((error) => {
                console.error("삭제 오류:", error);
                alert("삭제 중 오류가 발생했습니다.");
            });
        }
    };

    // 페이지네이션 관련 함수.
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = notices.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 번호 변경
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="amdin-notice-list-container">
            <h1 className="admin-notice-title">메인 공지사항 목록</h1>
            {isAdmin && (
                <div className="admin-notice-button-group">
                    <Button variant="outlined" onClick={() => navigate("/adminNoticeManager/write")} style={{ marginLeft: "auto" }}>
                        메인 공지사항 추가
                    </Button>
                </div>
            )}

            <table className="amdin-notice-table">
                <thead className="amdin-notice-thead">
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>첨부파일</th>
                        {isAdmin && <th>비고</th>}
                    </tr>
                </thead>
                <tbody className="admin-notice-tbody">
                    {currentItems.map((notice, index) => (
                        <tr key={notice.id}
                            className={index % 2 === 0 ? 'even' : ''}
                            onClick={() => handleRowClick(notice.id)}
                        >
                            <td>{notices.length - (currentPage - 1) * itemsPerPage - index}</td> {/* 역순 번호 출력 */}
                            <td>{notice.title}</td>
                            <td>{formatDate(notice.createdDate)}</td>
                            <td>
                                {notice.fileName ? ( // 첨부파일 유무에 따라 표기 다름.
                                    <span className="admin-notice-attachment-icon"><MdAttachFile/></span>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                            {isAdmin && (
                                <td className='admin-notice-functionButton'>
                                    <Button variant="outlined" onClick={(e) => handleEditClick(e, notice.id)}>수정</Button>
                                    <Button variant="outlined" color='error' onClick={(e) => handleDeleteClick(e, notice.id)}>삭제</Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            {/* 페이지네이션 버튼 추가 */}
            <div className="pagination-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Pagination
                count={Math.ceil(notices.length / itemsPerPage)} // 전체 페이지 수
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

export default AdminNoticeManagerList;
