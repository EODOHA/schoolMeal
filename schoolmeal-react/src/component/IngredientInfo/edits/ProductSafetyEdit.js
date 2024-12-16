
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import '../../../css/ingredientInfo/IngredientInfoEdit.css';
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProductSafetyEdit = () => {
    const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
    const [businessStatus] = useState(["영업중", "휴업중", "폐업"]);
    const { token } = useAuth();
    const { haccpId } = useParams();
    const navigate = useNavigate();
    const [haccp, setHaccp] = useState(null);

    const [form, setForm] = useState({
        haccpDesignationNumber: "",
        category: categories[0], // 기본값 설정
        businessName: "",
        address: "",
        productName: "",
        businessStatus: businessStatus[0],
        certificationEndDate: "",
        createdDate: ""
    });

    useEffect(() => {
        // 데이터 가져오기
        fetch(`${SERVER_URL}haccp/${haccpId}`)
            .then((response) => response.json())
            .then((data) => {
                setHaccp(data); // 받아온 데이터를 haccp에 저장
                setForm({
                    haccpDesignationNumber: data.haccpDesignationNumber,
                    category: data.category || categories[0],
                    businessName: data.businessName,
                    address: data.address,
                    productName: data.productName,
                    businessStatus: data.businessStatus || businessStatus[0],
                    certificationEndDate: data.certificationEndDate,
                    createdDate: data.createdDate
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [businessStatus, categories, haccpId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCancel = () => {
        navigate("/ingredientInfo/haccp-info"); // 취소 시 목록 페이지로 이동
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${SERVER_URL}haccp/${haccpId}`, {
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
                alert("HACCP 인증 정보가 수정되었습니다.");
                navigate("/ingredientInfo/haccp-info"); // 수정 후 목록 페이지로 이동
            })
            .catch((error) => {
                console.error("수정 오류:", error);
                alert("수정 중 오류가 발생하였습니다.");
            });
    };
    // useEffect(() => {
    //     if (!haccp) {
    //         handleBackToList();
    //     }
    // }, [haccp]);

    // const handleBackToList = () => {
    //     alert("데이터가 존재하지 않습니다. 목록으로 돌아갑니다.");
    //     navigate("/ingredientInfo/haccp-info");

    // };

    if (!haccp) {
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
                <h2>HACCP 인증 정보 수정</h2>
                <form onSubmit={handleSubmit}>
                    <div className="ingredient-info-form-group">
                        <label>HACCP 지정번호</label>
                        <input
                            type="text"
                            name="haccpDesignationNumber"
                            value={form.haccpDesignationNumber}
                            readOnly
                            disabled
                        />
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
                            type="text"
                            name="businessName"
                            value={form.businessName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="ingredient-info-form-group">
                        <label>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="ingredient-info-form-group">
                        <label>품목명</label>
                        <input
                            type="text"
                            name="productName"
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