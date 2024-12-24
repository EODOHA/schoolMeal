import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../sign/AuthContext';
import { SERVER_URL } from '../../../Constants';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../../css/mealCounsel/CounselHistroyList.css';
import Button from '@mui/material/Button';

/* 목록을 볼 수 는 있지만 관리자가 아니면 작성도 내용도 볼 수 없도록 제작*/
/*useAuth 활용*/
function CounselHistoryList() {
    const [counselHistories, setCounselHistories] = useState([]);
     const { token } = useAuth();
    const [filters, setFilters] = useState({
      author: '',
      title: '',
      counselContent: '',
      date: ''
    });
  
    useEffect(() => {
      fetchCounselHistories();
    }, []);
  
    const fetchCounselHistories = async () => {
      try {
        const params = {};
        if (filters.author) params.author = filters.author;
        if (filters.title) params.title = filters.title;
        if (filters.counselContent) params.counselContent = filters.counselContent;
        if (filters.date) params.date = filters.date;
  
        const response = await axios.get(`${SERVER_URL}counselHistory/counsellist`, { params });
        setCounselHistories(response.data);
      } catch (error) {
        console.error('상담 기록을 가져오는 중 오류 발생:', error);
      }
    };
  
    const handleInputChange = (e) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSearch = (e) => {
      e.preventDefault();
      fetchCounselHistories();
    };
  
    return (
      <div className="counsel-history-list">
        <h2>상담 기록 목록</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="author"
            placeholder="작성자"
            value={filters.author}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={filters.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="counselContent"
            placeholder="상담 내용"
            value={filters.counselContent}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="date"
            placeholder="날짜"
            value={filters.date}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" type="submit">
            검색
          </Button>
        </form>
        <Button variant="contained" color="secondary" component={Link} to="/counselHistory/counselwrite">
          상담 기록 추가
        </Button>
        <table className="counsel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {counselHistories.map(history => (
              <tr key={history.id}>
                <td>{history.id}</td>
                <td>{history.title}</td>
                <td>{history.author}</td>
                <td>{history.counselDate}</td>
                <td>
                  <Button component={Link} to={`/counselHistory/counseldetail/${history.id}`} variant="outlined" color="primary">
                    보기
                  </Button>
                  {' '}
                  <Button component={Link} to={`/counselHistory/counseledit/${history.id}`} variant="outlined" color="secondary">
                    수정
                  </Button>
                </td>
              </tr>
            ))}
            {counselHistories.length === 0 && (
              <tr>
                <td colSpan="5">상담 기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default CounselHistoryList;