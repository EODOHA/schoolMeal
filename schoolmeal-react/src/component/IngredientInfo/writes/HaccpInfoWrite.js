import React, { useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";

const HaccpInfoWrite = ({setIsWriting, fetchHaccpData}) => {
  const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
  const { token } = useAuth();


  const [form, setForm] = useState({
    haccpDesignationNumber: "",
    category: categories[0],
    businessName: "",
    address: "",
    productName: "",
    businessStatus: "",
    certificationEndDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${SERVER_URL}haccp`, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          alert("HACCP 정보가 추가되었습니다!");
         fetchHaccpData();
         setIsWriting(false);
          // 글쓰기를 종료하고 리스트로 돌아가기
        } else {
          alert("추가 중 오류가 발생했습니다.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <h1>HACCP 인증정보 추가</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="haccpDesignationNumber"
            placeholder="HACCP 지정번호"
            value={form.haccpDesignationNumber}
            onChange={handleChange}
          />
        </div>

        <div>
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

        <div>
          <input
            name="businessName"
            placeholder="업소명"
            value={form.businessName}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            name="address"
            placeholder="주소"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            name="productName"
            placeholder="품목명"
            value={form.productName}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            name="businessStatus"
            placeholder="영업상태"
            value={form.businessStatus}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="date"
            name="certificationEndDate"
            value={form.certificationEndDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit">추가</button>
      </form>
    </div>
  );
};

export default HaccpInfoWrite;