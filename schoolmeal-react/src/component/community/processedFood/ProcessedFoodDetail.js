import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useParams, useNavigate 추가
import { SERVER_URL } from "../../../Constants";
import "../../../css/community/ProcessedFoodDetail.css"; 
import { useAuth } from "../../sign/AuthContext";  // 권한설정
import ProcessedFoodComments from './ProcessedFoodComments'; // 댓글 컴포넌트 임포트

const ProcessedFoodDetail = () => {
  const { id: foodId } = useParams(); // URL에서 foodId를 가져옵니다.
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin , isBoardAdmin , token} = useAuth();  // 로그인 상태 확인

  useEffect(() => {
    // 가공식품 정보 조회 요청
    const fetchFood = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL}processed-foods/list/${foodId}`);
        setFood(response.data);
      } catch (error) {
        console.error('가공식품 조회 실패:', error);
        alert('가공식품 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (foodId) {
      fetchFood();
    }
  }, [foodId]);

  const handleDelete = () => {
    if (window.confirm('정말 이 가공식품 정보를 삭제하시겠습니까?')) {
      axios
        .delete(`${SERVER_URL}processed-foods/delete/${foodId}`, {
          headers: {
            Authorization: `${token}`, // 인증 토큰 추가
          },
        })
        .then(() => {
          alert('가공식품 정보가 삭제되었습니다.');
          navigate('/community/processed-foods'); // 삭제 후 목록으로 돌아가기
        })
        .catch((error) => {
          console.error('가공식품 삭제 실패:', error);
          alert('가공식품 삭제에 실패했습니다.');
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!food) {
    return <div>가공식품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="detail-container">
      <h2>가공식품 정보 상세 조회</h2>

      {food.imagePath && (
        <div className="image-container">
          <img
            src={`data:image/jpeg;base64,${food.imagePath}`}
            alt={food.productName}
            className="food-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>
      )}

      <table className="processed-food-detail-table">
        <tbody>
          <tr>
            <th>상품명</th>
            <td>{food.productName}</td>
          </tr>
          <tr>
            <th>가격</th>
            <td>{food.price.toLocaleString()}₩</td>
          </tr>
          <tr>
            <th>소비자가</th>
            <td>{food.consumerPrice.toLocaleString()}₩</td>
          </tr>
          <tr>
            <th>회사명</th>
            <td>{food.companyName}</td>
          </tr>
          <tr>
            <th>주소 (링크)</th>
            <td>
              <a href={food.addressLink} target="_blank" rel="noopener noreferrer">
                {food.addressLink}
              </a>
            </td>
          </tr>
          <tr>
            <th>상세 소개</th>
            <td>
              <div className="detail-description">
                {food.description}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="processedFoodDetailbutton-group">
        {(isAdmin || isBoardAdmin) && (
          <button onClick={() => navigate(`/community/processed-foods/edit/${foodId}`)} className="processedFoodDetailedit-btn">수정</button>
        )}

        {(isAdmin || isBoardAdmin) && (
          <button onClick={handleDelete} className="processedFoodDetaildelete-btn">삭제</button>
        )}

        
        
        <button onClick={() => navigate('/community/processed-foods')} className="processedFoodDetailback-btn">뒤로 가기</button>
      </div>

      <ProcessedFoodComments foodId={foodId} />
    </div>
  );
};

export default ProcessedFoodDetail;
