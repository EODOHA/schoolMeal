import React, { useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import '../../../css/ingredientInfo/IngredientInfoWrite.css';
import { Button } from "@mui/material";


const IngredientPriceWrite = () => {
  const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
  const [productDistricts] = useState(["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "수원", "춘천", "청주", "천안", "전주", "포항", "제주", "성남", "의정부", "순천"]);
  const [grades] = useState(["상", "중상", "중", "중하", "하"]);
  const { token } = useAuth();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    category: categories[0],
    productName: "",
    grade: grades[0],
    productDistrict: productDistricts[0],
    productPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}price`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("식재료 가격 정보가 추가되었습니다!");
        // 목록 페이지로 이동
        navigate("/ingredientInfo/ingredient-price", { state: { refresh: true } });
      } else {
        alert("추가 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  const handleBackToList = () => {
    navigate('/ingredientInfo/ingredient-price');
  }


  return (
    <div className="ingredient-info-write-container">
      <div className="ingredient-info-card">
        <h2>식재료 가격 정보 추가</h2>
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
              name="productName"
              placeholder="품목명을 입력하세요."
              required
              value={form.productName}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>등급</label>
            <select
              name="grade"
              value={form.grade}
              onChange={handleChange}
            >
              {grades.map((gradeOption) => (
                <option key={gradeOption} value={gradeOption}>
                  {gradeOption}
                </option>
              ))}
            </select>
          </div>
          <div className="ingredient-info-form-group">
            <label>생산지</label>
            <select
              name="productDistrict"
              value={form.productDistrict}
              onChange={handleChange}
            >
              {productDistricts.map((disctrictOption) => (
                <option key={disctrictOption} value={disctrictOption}>
                  {disctrictOption}
                </option>
              ))}
            </select>
          </div>
          <div className="ingredient-info-form-group">
            <label>가격</label>
            <input
              type="number"
              name="productPrice"
              placeholder="가격을 숫자로 입력하세요."
              value={form.productPrice}
              required
              onChange={(e) => handleChange(e)}
              onInput={(e) => {
                // 숫자만 입력 가능하게 제한 (정규식 사용)
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
            />
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
export default IngredientPriceWrite;