import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import "../../../css/community/CreateProcessedFood.css";

const CreateProcessedFood = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정할 게시글의 ID를 가져옵니다.
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [consumerPrice, setConsumerPrice] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [addressLink, setAddressLink] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // AuthContext에서 인증 상태와 권한 정보 가져오기
  const { isBoardAdmin, isAdmin, token } = useAuth();

  useEffect(() => {
    if (id) {
      fetchFoodToEdit(id);
    }
  }, [id]);

  const fetchFoodToEdit = async (foodId) => {
    try {
      const response = await axios.get(`${SERVER_URL}processed-foods/list/${foodId}`);
      const { productName, price, consumerPrice, companyName, addressLink, description } = response.data;
      setProductName(productName);
      setPrice(price);
      setConsumerPrice(consumerPrice);
      setCompanyName(companyName);
      setAddressLink(addressLink);
      setDescription(description);
    } catch (error) {
      console.error('가공식품 정보 불러오기 실패:', error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foodData = { productName, price, consumerPrice, companyName, addressLink, description };

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(foodData)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (id) {
        await axios.put(`${SERVER_URL}processed-foods/update/${id}`, formData, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('가공식품 정보가 수정되었습니다.');
      } else {
        await axios.post(`${SERVER_URL}processed-foods/create`, formData, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('가공식품 정보가 작성되었습니다.');
      }
      navigate('/community/processed-foods'); // 작성 또는 수정 후 가공식품 목록으로 이동
    } catch (error) {
      console.error('가공식품 정보 요청 실패:', error);
      alert('가공식품 정보 요청에 실패했습니다.');
    }
  };

  return (
    <div className="processedFoodCrudform-container">
      <h2>{id ? '가공식품 수정' : '가공식품 작성'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="processedFoodCrudform-group">
          <label>이미지 업로드:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="processedFoodCrudform-group">
          <label>상품명:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="processedFoodCrudform-group">
          <label>가격:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="processedFoodCrudform-group">
          <label>소비자가:</label>
          <input
            type="number"
            value={consumerPrice}
            onChange={(e) => setConsumerPrice(e.target.value)}
          />
        </div>
        <div className="processedFoodCrudform-group">
          <label>회사명:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="processedFoodCrudform-group">
          <label>주소(링크):</label>
          <input
            type="text"
            value={addressLink}
            onChange={(e) => setAddressLink(e.target.value)}
          />
        </div>
        <div className="processedFoodCrudform-group">
          <label>상세 소개:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="processedFoodCrudsubmit-btn">
          {id ? '수정하기' : '작성하기'}
        </button>
      </form>
    </div>
  );
};

export default CreateProcessedFood;
