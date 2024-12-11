import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";

const HaccpInfoEdit = ({ haccp, setEditMode, setHaccpList }) => {
    const [categories] = useState(["농산물", "축산물", "수산물", "공산품"]);
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        haccpDesignationNumber: "",
        category: "",
        businessName: "",
        address: "",
        productName: "",
        businessStatus: "",
        certificationEndDate: "",
    });

    useEffect(() => {
        if (haccp) {
            setFormData({
                haccpDesignationNumber: haccp.haccpDesignationNumber,
                category: haccp.category || categories[0], // 카테고리 기본값 설정
                businessName: haccp.businessName,
                address: haccp.address,
                productName: haccp.productName,
                businessStatus: haccp.businessStatus,
                certificationEndDate: haccp.certificationEndDate,
            });
        }
    }, [haccp]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${SERVER_URL}haccp/${haccp._links.self.href.split("/").pop()}`, {
            method: "PUT",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                // 응답 상태 코드확인
                if (!response.ok) {
                    throw new Error(`HTTP 오류: ${response.status}`);
                }
                return response.json(); // 응답을 JSON으로 변환
            })
            .then((updatedData) => {
                // 수정된 데이터를 목록에 반영
                setHaccpList((prevList) =>
                    prevList.map((item) =>
                        item._links.self.href === haccp._links.self.href ? updatedData : item
                    )
                );
                alert("HACCP 인증 정보가 수정되었습니다.")
                setEditMode(false); // 수정 모드 종료
            })
            .catch((error) => {
                console.error("수정오류:", error);
                alert("수정 중 오류가 발생하였습니다.")
            });
    };

    return (
        <div>
            <h1>인증정보 수정</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>HACCP 지정번호</label>
                    <input type="text" name="haccpDesignationNumber" value={formData.haccpDesignationNumber} readOnly />
                </div>
                <div>
                    <label>카테고리</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((categoryOption)=>(
                            <option key={categoryOption} value={categoryOption}>
                                {categoryOption}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>업소명</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>주소</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>품목명</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>영업상태</label>
                    <input
                        type="text"
                        name="businessStatus"
                        value={formData.businessStatus}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>인증종료일자</label>
                    <input
                        type="date"
                        name="certificationEndDate"
                        value={formData.certificationEndDate}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">수정하기</button>
            </form>
            <button onClick={() => setEditMode(false)}>취소</button>
        </div>
    );
};

export default HaccpInfoEdit;