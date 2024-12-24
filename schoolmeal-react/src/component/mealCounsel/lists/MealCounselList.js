import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../sign/AuthContext';
import { SERVER_URL } from '../../../Constants';
import { useNavigate } from 'react-router-dom';
import '../../../css/mealCounsel/MealCounselList.css';
import { TfiVideoClapper } from 'react-icons/tfi';
import { BsFileExcel } from 'react-icons/bs';
import Button from '@mui/material/Button';
import { HiChevronLeft, HiChevronDoubleLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi";
import '../../../css/page/Pagination.css';

const MealCounselList = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState({ title: '', author: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const { token, isAdmin, isBoardAdmin } = useAuth();
  const navigate = useNavigate();

  const [postsPerPage] = useState(5);
  const [pageNumbersPerBlock] = useState(4);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentBlock = Math.ceil(currentPage / pageNumbersPerBlock);
  const startPage = (currentBlock - 1) * pageNumbersPerBlock + 1;
  const endPage = Math.min(startPage + pageNumbersPerBlock - 1, totalPages);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}mealcounsel/list`, {
        headers: {
          'Authorization': token,
        },
      });
      setPosts(response.data.reverse());
    } catch (error) {
      console.error('게시글을 불러오는 데 실패하였습니다.', error);
      alert('게시글을 불러오는 데 실패하였습니다.');
    }
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleResetSearch = () => {
    setSearch({ title: '', author: '' });
  };

  const handleRowClick = (id) => {
    navigate(`/mealCounsel/detail/${id}`);
  };

  const handleWriteClick = () => {
    navigate('/mealCounsel/writepost');
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevBlock = () => {
    setCurrentPage(Math.max(currentPage - pageNumbersPerBlock, 1));
  };

  const handleNextBlock = () => {
    setCurrentPage(Math.min(currentPage + pageNumbersPerBlock, totalPages));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? '유효하지 않은 날짜'
      : `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const currentPosts = posts
    .filter(item => {
      const titleMatch = !search.title || item.title.toLowerCase().includes(search.title.toLowerCase());
      const authorMatch = !search.author || item.author.toLowerCase().includes(search.author.toLowerCase());
      return titleMatch && authorMatch;
    })
    .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className="meal-list-container">
      <h1 className="meal-title">영양상담 자료실</h1>
      <div className="meal-button-group">
        {(isAdmin || isBoardAdmin) && (
          <Button variant="contained" color="secondary" onClick={handleWriteClick}>
            새 글 쓰기
          </Button>
        )}
      </div>
      <form className="meal-search-form">
        <input
          type="text"
          name="title"
          value={search.title}
          onChange={handleSearchChange}
          placeholder="제목 검색"
        />
        <input
          type="text"
          name="author"
          value={search.author}
          onChange={handleSearchChange}
          placeholder="작성자 검색"
        />
        <Button variant="outlined" color="secondary" onClick={handleResetSearch}>
          초기화
        </Button>
      </form>
      <table className="meal-table">
        <thead className="meal-thead">
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>첨부파일</th>
          </tr>
        </thead>
        <tbody className="meal-tbody">
          {currentPosts.length === 0 ? (
            <tr>
              <td colSpan="5">데이터가 없습니다.</td>
            </tr>
          ) : (
            currentPosts.map((post, index) => (
              <tr key={post.id} onClick={() => handleRowClick(post.id)} style={{ cursor: 'pointer' }}>
                <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{formatDate(post.createdAt)}</td>
                <td>
                  {post.fileIds && post.fileIds.length > 0 ? (
                    <a href={`${SERVER_URL}mealcounsel/files/${post.fileIds[0]}`} target="_blank" rel="noopener noreferrer">
                      <TfiVideoClapper />
                    </a>
                  ) : (
                    <BsFileExcel />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <Button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <HiChevronDoubleLeft />
          </Button>
          <Button onClick={handlePrevBlock} disabled={currentPage <= pageNumbersPerBlock}>
            <HiChevronLeft />
          </Button>
          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
            <Button
              key={startPage + idx}
              onClick={() => handlePageClick(startPage + idx)}
              className={currentPage === startPage + idx ? 'selected' : ''}
            >
              {startPage + idx}
            </Button>
          ))}
          <Button onClick={handleNextBlock} disabled={currentPage + pageNumbersPerBlock > totalPages}>
            <HiChevronRight />
          </Button>
          <Button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            <HiChevronDoubleRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealCounselList;
