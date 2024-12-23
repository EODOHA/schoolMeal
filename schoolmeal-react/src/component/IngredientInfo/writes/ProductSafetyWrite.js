import React, { useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import '../../../css/ingredientInfo/IngredientInfoWrite.css';
import { Button } from "@mui/material";


const ProductSafetyWrite = () => {
  const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
  const [districts] = useState(["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "수원", "춘천", "청주", "천안", "전주", "포항", "제주", "성남", "의정부", "순천"]);
  const [safetyResults] = useState(["적합", "부적합", "분석중"]);
  const { token } = useAuth();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    category: categories[0], // 기본값 설정
    productName: "",
    producer: "",
    safetyResult: safetyResults[0],
    inspector: "",
    inspectMaterial: "",
    productDistrict: districts[0],
    createdDate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}safety`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("식품 안정성 조사결과가 추가되었습니다!");
        // 목록 페이지로 이동
        navigate("/ingredientInfo/product-safety", { state: { refresh: true } });
      } else {
        alert("추가 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  const handleBackToList = () => {
    navigate('/ingredientInfo/product-safety');
  }

  return (
    <div className="ingredient-info-write-container">
      <div className="ingredient-info-card">
        <h2> 식품 안정성 검사 결과정보 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="ingredient-info-form-group">
            <label>카테고리</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </div>
          <div className="ingredient-info-form-group">
            <label>품목명</label>
            <input
              type="text"
              name="productName"
              required
              placeholder="품목명을 입력하세요."
              value={form.productName}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>생산자</label>
            <input
              type="text"
              name="producer"
              required
              placeholder="생산자를 입력하세요."
              value={form.producer}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>분석결과</label>
            <select
              name="safetyResult"
              value={form.safetyResult}
              onChange={handleChange}
            >
              {safetyResults.map((resultOption) => (
                <option key={resultOption} value={resultOption}>
                  {resultOption}
                </option>
              ))}
            </select>
          </div>
          <div className="ingredient-info-form-group">
            <label>조사기관</label>
            <input
              type="text"
              name="inspector"
              required
              placeholder="조사기관을 입력하세요."
              value={form.inspector}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>조사물질</label>
            <input
              type="text"
              name="inspectMaterial"
              required
              placeholder="조사물질을 입력하세요."
              value={form.inspectMaterial}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>생산지</label>
            <select
              name="productDistrict"
              value={form.productDistrict}
              onChange={handleChange}
            >
              {districts.map((districtOption) => (
                <option key={districtOption} value={districtOption}>
                  {districtOption}
                </option>
              ))}
            </select>
          </div>
          <div className="ingredient-info-button-group">
            <Button type="submit" className="ingredient-info-button submit">
              저장하기
            </Button>
            <Button
              type="button"
              onClick={handleBackToList}
              className="ingredient-info-button cancel"
            >
              뒤로가기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProductSafetyWrite;