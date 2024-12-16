import React, { useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import '../../../css/ingredientInfo/IngredientInfoWrite.css';
import { Button } from "@mui/material";


const HaccpInfoWrite = () => {
  const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
  const [businessStatus] = useState(["영업중", "휴업중", "폐업"]);
  const { token } = useAuth();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    haccpDesignationNumber: "",
    category: categories[0],
    businessName: "",
    address: "",
    productName: "",
    businessStatus: businessStatus[0],
    certificationEndDate: "",
  });

  const [errors, setErrors] = useState({
    haccpDesignationNumber: "",
  });

  const validateHaccpNumber = (number) => {
    // HACCP 번호 형식 검사 (0000-00-0000)
    const regex = /^\d{4}-\d{2}-\d{4}$/;
    return regex.test(number);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // HACCP 번호 변경 시 유효성 검사
    if (name === "haccpDesignationNumber" && value !== "") {
      if (!validateHaccpNumber(value)) {
        setErrors({
          ...errors,
          haccpDesignationNumber: "올바른 형식으로 입력해주세요 (0000-00-0000)",
        });
      } else {
        setErrors({ ...errors, haccpDesignationNumber: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // HACCP 번호가 올바른지 확인 후 전송
    if (!validateHaccpNumber(form.haccpDesignationNumber)) {
      setErrors({
        ...errors,
        haccpDesignationNumber: "올바른 형식으로 입력해주세요 (0000-00-0000)",
      });
      return; // 유효하지 않으면 제출하지 않음
    }
    try {
      const response = await fetch(`${SERVER_URL}haccp`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("HACCP 정보가 추가되었습니다!");
        // 목록 페이지로 이동
        navigate("/ingredientInfo/haccp-info", { state: { refresh: true } });
      } else {
        alert("추가 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  const handleBackToList = () => {
    navigate('/ingredientInfo/haccp-info');
  }

  return (
    <div className="ingredient-info-write-container">
      <div className="ingredient-info-card">
        <h2>HACCP 인증정보 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="ingredient-info-form-group">
            <label>HACCP 지정번호</label>
            <input
              type="text"
              name="haccpDesignationNumber"
              placeholder="HACCP 지정번호"
              value={form.haccpDesignationNumber}
              onChange={handleChange}
            />
            {errors.haccpDesignationNumber && (
              <div className="ingredient-info-error-message">
                {errors.haccpDesignationNumber}
              </div>
            )}
          </div>
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
            <label>업소명</label>
            <input
              name="businessName"
              placeholder="업소명"
              value={form.businessName}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>주소</label>
            <input
              name="address"
              placeholder="주소"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>품목명</label>
            <input
              name="productName"
              placeholder="품목명"
              value={form.productName}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-info-form-group">
            <label>영업상태</label>
            <select
              name="businessStatus"
              value={form.businessStatus}
              onChange={handleChange}
            >
              {businessStatus.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
          <div className="ingredient-info-form-group">
            <label>인증 종료일자</label>
            <input
              type="date"
              name="certificationEndDate"
              value={form.certificationEndDate}
              onChange={handleChange}
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

export default HaccpInfoWrite;