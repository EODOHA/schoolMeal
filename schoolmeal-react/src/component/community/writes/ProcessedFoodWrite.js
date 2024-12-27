import React, { useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../../../css/community/ProcessedFoodWrite.css";


const ProcessedFoodWrite = () => {
  const { token } = useAuth();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    productName: "",
    price: 0,
    consumerPrice: 0,
    companyName: "",
    addressLink: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}processedFood`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("가공식품정보가 추가되었습니다!");
        // 목록 페이지로 이동
        navigate("/community/processedFood", { state: { refresh: true } });
      } else {
        alert("추가 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  const handleBackToList = () => {
    navigate('/community/processedFood');
  }


  return (
    <div className="processed-food-write-container">
      <div className="processed-food-card">
        <h2>가공식품정보 추가</h2>
        <form onSubmit={handleSubmit}>

          <div className="processed-food-form-group">
            <label>품목명</label>
            <input
              type="text"
              name="productName"
              required
              value={form.productName}
              onChange={handleChange}
            />
          </div>
          <div className="processed-food-form-group">
            <label>가격</label>
            <input
              type="number"
              name="price"
              value={form.price}
              required
              onChange={(e) => handleChange(e)}
              onInput={(e) => {
                // 숫자만 입력 가능하게 제한 (정규식 사용)
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>
          <div className="processed-food-form-group">
            <label>소비자가격</label>
            <input
              type="number"
              name="consumerPrice"
              value={form.consumerPrice}
              required
              onChange={(e) => handleChange(e)}
              onInput={(e) => {
                // 숫자만 입력 가능하게 제한 (정규식 사용)
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
            />
          </div>
          <div className="processed-food-form-group">
            <label>회사명</label>
            <input
              type="text"
              name="companyName"
              required
              value={form.companyName}
              onChange={handleChange}
            />
          </div>
          <div className="processed-food-form-group">
            <label>회사 링크</label>
            <input
              type="text"
              name="addressLink"
              required
              value={form.addressLink}
              onChange={handleChange}
            />
          </div>
          <div className="processed-food-form-group">
            <label>설명</label>
            <input
              type="text"
              name="description"
              required
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="processed-food-button-group">
            <Button type="submit" className="processed-food-button submit">
              저장하기
            </Button>
            <Button
              type="button"
              onClick={handleBackToList}
              className="processed-food-button cancel"
            >
              뒤로가기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProcessedFoodWrite;