import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import '../../../css/ingredientInfo/IngredientInfoUpload.css';

const HaccpFileUpload = () => {
    const [haccpData, setHaccpData] = useState([]);
    const [selectedFile, setselectedFile] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    // 파일 선택 후 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setselectedFile(file);
        
        console.log(file); // 파일 객체가 제대로 출력되는지 확인
        console.log(file instanceof Blob); // true인지 확인
        if (!file) {
            alert("파일을 선택해주세요.");
            return;
        }
        readExcelFile(selectedFile);
    };

    // 파일 초기화
    const handleFileReset = () => {
        setselectedFile(null);  // 파일 상태 초기화
        setHaccpData([]);       // 파싱된 데이터 초기화
    }


    //excel 파일 파싱
    const readExcelFile = (file) => {

        if (!(file instanceof Blob)) {
            console.error("올바르지 않은 파일 형식입니다.");
            alert("올바르지 않은 파일 형식입니다. 다시 시도하세요.");
            return;
        }
        const reader = new FileReader();
        // reader.onloadstart = () => console.log("파일 읽기 시작...");
        // reader.onloadend = () => console.log("파일 읽기 완료!");
        // reader.onerror = (err) => console.error("파일 읽기 중 오류 발생:", err);


        reader.onload = (e) => {
            const arrayBuffer = e.target.result;

            // 엑셀 파일을 파싱
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

            //첫번째 시트 가져오기
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            //시트 데이터를 JSON으로 변환
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });   //첫번째 행을 헤더로 사용

            //첫번째 행(헤더)를 제외하고, 두번째 행부터 매핑
            // 데이터 필터링 및 매핑
            const haccpData = jsonData.slice(1).filter(row =>
                row.every(cell => cell !== null && cell !== undefined && cell !== '') // 모든 셀 값이 null, undefined, 빈 문자열이 아닌지 체크
            ).map((row) => ({
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

        reader.readAsArrayBuffer(file);
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

        // 업로드 확인
        const confirmUpload = window.confirm("업로드하시겠습니까?");
        if (!confirmUpload) {
            return; // 취소하면 업로드 진행하지 않음
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
                // console.log('성공:', data);
                alert('업로드가 완료되었습니다! 목록페이지로 돌아갑니다.');
                navigate('../ingredientInfo/haccp-info');

            })
            .catch((error) => {
                console.error('실패:', error);
                alert('업로드 중 오류가 발생하였습니다.');
            });
    };

    // 서식파일 다운로드 함수
    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/ingredientInfo/haccp-template.xlsx';
        link.download = 'haccp-template.xlsx'; // 다운로드 파일명
        link.click();
    }

    // 목록으로 돌아가기
    const handleBackToList = () => {
        navigate('../ingredientInfo/haccp-info');
    };

    return (
        <div className="ingredient-info-upload-container">
            <h2 className="ingredient-info-title">HACCP 데이터 업로드</h2>
            {/* 상단 버튼 그룹 */}
            <div className="ingredient-info-button-group">
                {/* 서식파일 다운로드 버튼 */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadTemplate}
                >
                    서식파일 다운받기
                </Button>
                {/* 파일 업로드 버튼 */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                >
                    데이터 적용
                </Button>
                {/* 목록으로 돌아가기 버튼 */}
                <Button
                    variant="contained"
                    onClick={handleBackToList}
                    className="ingredient-info-button back-to-list"
                >
                    뒤로가기
                </Button>
            </div>

            {/* 파일 업로드 */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            {selectedFile && (
                <p>선택된 파일: {selectedFile.name}</p>
            )}

            {/* 파일 초기화 버튼 */}
            {selectedFile && (
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleFileReset}
                    style={{ marginLeft: "10px" }}
                >
                    파일 초기화
                </Button>
            )}

            {/* 파싱된 데이터 출력 */}
            <h2 className="ingredient-info-upload-title">업로드된 데이터</h2>
            <table className="ingredient-info-upload-table">
                <thead className="ingredient-info-upload-thead">
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
                <tbody className="ingredient-info-upload-tbody">
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
        </div >
    );
};
export default HaccpFileUpload;