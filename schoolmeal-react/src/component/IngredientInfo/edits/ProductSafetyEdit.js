import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import '../../../css/ingredientInfo/IngredientInfoEdit.css';
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProductSafetyEdit = () => {
    const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
    const [districts] = useState(["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "수원", "춘천", "청주", "천안", "전주", "포항", "제주", "성남", "의정부", "순천"]);
    const [safetyResults] = useState(["적합", "부적합", "분석중"]);
    const { token } = useAuth();
    const { safetyId } = useParams();
    const navigate = useNavigate();
    const [safety, setSafety] = useState(null);

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

    useEffect(() => {
        // 데이터 가져오기
        fetch(`${SERVER_URL}safety/${safetyId}`)
            .then((response) => response.json())
            .then((data) => {
                setSafety(data); // 받아온 데이터를 price에 저장
                setForm({
                    category: data.category || categories[0], // 기본값 설정
                    productName: data.productName,
                    producer: data.producer,
                    safetyResult: data.safetyResult || safetyResults[0],
                    inspector: data.inspector,
                    inspectMaterial: data.inspectMaterial,
                    productDistrict: data.productDistrict || districts[0],
                    createdDate: data.createdDate
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [categories, districts, safetyResults, safetyId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCancel = () => {
        navigate("/ingredientInfo/product-safety"); // 취소 시 목록 페이지로 이동
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${SERVER_URL}safety/${safetyId}`, {
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
                navigate("/ingredientInfo/product-safety"); // 수정 후 목록 페이지로 이동
            })
            .catch((error) => {
                console.error("수정 오류:", error);
                alert("수정 중 오류가 발생하였습니다.");
            });
    };


    if (!safety) {
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
                <h2>식품 안정성 검사결과 정보 수정</h2>
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
                        <label>생산자</label>
                        <input
                            type="text"
                            name="producer"
                            required
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

export default ProductSafetyEdit;