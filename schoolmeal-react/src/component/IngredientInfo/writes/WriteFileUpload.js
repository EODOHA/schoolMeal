import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";

const WriteFileUpload = () => {
    const [file, setFile] = useState(null);
    const [haccpData, setHaccpData] = useState([]);
    const { token } = useAuth();

    // 파일 선택 후 처리
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        readExcelFile(selectedFile);
    };


    //excel 파일 파싱
    const readExcelFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target.result;

            //엑셀 파일을 파싱
            const workbook = XLSX.read(data, { type: 'binary' });

            //첫번째 시트 가져오기
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            //시트 데이터를 JSON으로 변환
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });   //첫번째 행을 헤더로 사용

            //첫번째 행(헤더)를 제외하고, 두번째 행부터 데이터 매핑
            const haccpData = jsonData.slice(1).map((row) => ({
                haccpDesignationNumber: row[0],
                category: row[1],
                businessName: row[2],
                address: row[3],
                productName: row[4],
                businessStatus: row[5],
                //날짜를 숫자에서 날짜 형식으로 변환
                certificationEndDate: convertExcelDate(row[6]),
            }));
            setHaccpData(haccpData);
        };
        reader.readAsBinaryString(file);
    };
    const convertExcelDate = (excelDate) => {
        if (excelDate) {
            // 엑셀 날짜는 1900년 1월 1일부터 시작되므로, 이를 JavaScript 날짜로 변환
            const date = new Date((excelDate - 25569) * 86400 * 1000);  //밀리초로 변환
            // 'YYYY-MM-DD' 형식으로 날짜를 변환
            const yyyy = date.getFullYear();
            const mm = (date.getMonth() + 1).toString().padStart(2, '0');  // 월은 0부터 시작하므로 +1
            const dd = date.getDate().toString().padStart(2, '0');

            return `${yyyy}-${mm}-${dd}`;
        }
        return null;
    };


    // 서버로 데이터 전송
    const handleSubmit = () => {
        if (haccpData.length === 0) {
            alert("파싱된 데이터가 없습니다. 파일을 올바르게 선택했는지 확인하세요.");
            return;
        }
        fetch(`${SERVER_URL}haccp-info/bulk-upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(haccpData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('성공:', data);
                alert('업로드 성공!');
            })
            .catch((error) => {
                console.error('실패:', error);
                alert('업로드 실패!');
            });
    };
    return (
        <div>
            <h1>HACCP 데이터 업로드</h1>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleSubmit}>업로드</button>

            <h2>파싱된 데이터</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>HACCP 지정번호</th>
                        <th>카테고리</th>
                        <th>업소명</th>
                        <th>주소</th>
                        <th>품목명</th>
                        <th>영업상태</th>
                        <th>인증 종료일자</th>
                    </tr>
                </thead>
                <tbody>
                    {haccpData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.haccpDesignationNumber}</td>
                            <td>{row.category}</td>
                            <td>{row.businessName}</td>
                            <td>{row.address}</td>
                            <td>{row.productName}</td>
                            <td>{row.businessStatus}</td>
                            <td>{row.certificationEndDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default WriteFileUpload;