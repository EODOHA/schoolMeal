import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import "../../../css/community/ProcessedFoodEdit.css";

const ProcessedFoodEdit = () => {
    const { token } = useAuth();
    const { processedFoodId } = useParams();
    const navigate = useNavigate();
    const [processedFood, setProcessedFood] = useState(null);

    const [form, setForm] = useState({
        productName: "",
        price: 0,
        consumerPrice: 0,
        companyName: "",
        addressLink: "",
        description: "",
        createdDate: ""
    });

    useEffect(() => {
        // 데이터 가져오기
        fetch(`${SERVER_URL}processedFood/${processedFoodId}`)
            .then((response) => response.json())
            .then((data) => {
                setProcessedFood(data);
                setForm({
                    productName: data.productName,
                    price: data.price,
                    consumerPrice: data.consumerPrice,
                    companyName: data.companyName,
                    addressLink: data.addressLink,
                    description: data.description,
                    createdDate: data.createdDate,
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [processedFoodId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCancel = () => {
        navigate("/community/processedFood"); // 취소 시 목록 페이지로 이동
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${SERVER_URL}processedFood/${processedFoodId}`, {
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
                alert("가공식품정보가 수정되었습니다.");
                navigate("/community/processedFood"); // 수정 후 목록 페이지로 이동
            })
            .catch((error) => {
                console.error("수정 오류:", error);
                alert("수정 중 오류가 발생하였습니다.");
            });
    };


    if (!processedFood) {
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
        <div className="processed-food-edit-container">
            <div className="processed-food-card">
                <h2>가공식품정보 수정</h2>
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
                            수정하기
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
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

export default ProcessedFoodEdit;