import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/community/ProcessedFoodList.css";

const ProcessedFoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [filteredFoods, setFilteredFoods] = useState([]); // 필터링된 데이터 상태
  const navigate = useNavigate();
  const { isAdmin , isBoardAdmin  } = useAuth();

  const loadFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}processed-foods/list`);
      const sortedFoods = (response.data || []).sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setFoods(sortedFoods);
      setFilteredFoods(sortedFoods); // 초기 데이터 설정
    } catch (error) {
      console.error('가공식품 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  // 검색 버튼 클릭 시 필터링
  const handleSearch = () => {
    const result = foods.filter((food) =>
      food.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(result);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="processed-food-list-container">
      <h2>가공식품 정보 목록</h2>

      {/* 검색 입력창 및 검색 버튼 + 글 작성 버튼 */}
      <div className="ProcessedFoodSearchContainer">
        {/* 글 작성 버튼 */}
        {(isAdmin || isBoardAdmin) && (
          <button onClick={() => navigate('/community/processed-foods/create')} className="processedfoodlistcreate-button">
            가공식품 작성
          </button>
        )}

        {/* 검색 영역 */}
        <div className="SearchWrapper">
          <input
            type="text"
            placeholder="상품명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ProcessedFoodSearchInput"
          />
          <button onClick={handleSearch} className="ProcessedFoodSearchButton">
            검색하기
          </button>
        </div>
      </div>

      <table className="food-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>상품 이미지</th>
            <th>상품명</th>
            <th>회사명</th>
            <th>가격</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food, index) => (
              <tr key={food.id} onClick={() => navigate(`/community/processed-foods/${food.id}`)}>
                <td>{filteredFoods.length - index}</td>
                <td>
                  {food.imagePath ? (
                    <img
                      src={`data:image/jpeg;base64,${food.imagePath}`}
                      alt={food.productName}
                      className="food-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100";
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">-</div>
                  )}
                </td>
                <td>{food.productName}</td>
                <td>{food.companyName}</td>
                <td>{food.price.toLocaleString()}₩</td>
                <td>{new Date(food.createdDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">가공식품 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessedFoodList;
