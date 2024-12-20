import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import '../../../css/ingredientInfo/IngredientInfoEdit.css';
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const IngredientPriceEdit = () => {
    const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
    const [productDistricts] = useState(["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "수원", "춘천", "청주", "천안", "전주", "포항", "제주", "성남", "의정부", "순천"]);
    const [grades] = useState(["상", "중상", "중", "중하", "하"]);
    const { token } = useAuth();
    const { priceId } = useParams();
    const navigate = useNavigate();
    const [price, setPrice] = useState(null);

    const [form, setForm] = useState({
        category: categories[0], // 기본값 설정
        productName: "",
        grade: grades[0],
        productDistrict: productDistricts[0],
        productPrice: "",
        createdDate: ""
    });

    useEffect(() => {
        // 데이터 가져오기
        fetch(`${SERVER_URL}price/${priceId}`)
            .then((response) => response.json())
            .then((data) => {
                setPrice(data);
                setForm({
                    category: data.category || categories[0],
                    productName: data.productName,
                    grade: data.grade || grades[0],
                    productDistrict: data.productDistrict || productDistricts[0],
                    productPrice: data.productPrice,
                    createdDate: data.createdDate
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [categories, productDistricts, priceId, grades]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCancel = () => {
        navigate("/ingredientInfo/ingredient-price"); // 취소 시 목록 페이지로 이동
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${SERVER_URL}price/${priceId}`, {
            method: "PUT",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP 오류: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert("식재료 가격 정보가 수정되었습니다.");
                navigate("/ingredientInfo/ingredient-price"); // 수정 후 목록 페이지로 이동
            })
            .catch((error) => {
                console.error("수정 오류:", error);
                alert("수정 중 오류가 발생하였습니다.");
            });
    };


    if (!price) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center', // 수평 가운데 정렬
                alignItems: 'center', // 수직 가운데 정렬
                height: '30vh' // 전체 화면 높이
            }}>
                <CircularProgress />
            </div>
        );
    };
    return (
        <div className="ingredient-info-edit-container">
            <div className="ingredient-info-card">
                <h2>식재료 가격 정보 수정</h2>
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
                            {productDistricts.map((districtOption) => (
                                <option key={districtOption} value={districtOption}>
                                    {districtOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="ingredient-info-form-group">
                        <label>가격</label>
                        <input
                            type="number"
                            name="productPrice"
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
                            수정하기
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
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

export default IngredientPriceEdit;