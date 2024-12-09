import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";  // 권한설정
import "../../../css/community/ProcessedFoodList.css";

const ProcessedFoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin , isAuth} = useAuth();  // 로그인 상태 확인

  const loadFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}processed-foods/list`);
      const sortedFoods = (response.data || []).sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setFoods(sortedFoods);
    } catch (error) {
      console.error('가공식품 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="processed-food-list-container">
      <h2>가공식품 정보 목록</h2>
      {isAuth && (
        <button onClick={() => navigate('/community/processed-foods/create')} className="processedfoodlistcreate-button">
        가공식품 작성
      </button>
      )}
      
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
          {Array.isArray(foods) && foods.length > 0 ? (
            foods.map((food, index) => (
              <tr key={food.id} onClick={() => navigate(`/community/processed-foods/${food.id}`)}>
                <td>{foods.length - index}</td>
                <td>
                  {food.imagePath ? (
                    <img
                      src={`data:image/jpeg;base64,${food.imagePath}`}
                      alt={food.productName}
                      className="food-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100"; // 이미지 로드 실패 시 기본 이미지 표시
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">-</div> // 이미지가 없을 경우 빈 칸 혹은 대체 요소 표시
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