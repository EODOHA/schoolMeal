import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { SERVER_URL } from "../../../Constants";
import { useAuth } from "../../sign/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../../../css/community/ProcessedFoodUpload.css";

const ProcessedFoodUpload = () => {
    const [proceesedFoodData, setProcessedFoodData] = useState([]);
    const [selectedFile, setselectedFile] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    // 파일 선택 후 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setselectedFile(file);
        if (!file) {
            alert("파일을 선택해주세요.");
            return;
        }
        readExcelFile(file);
    };

    // useEffect(() => {
    //     if (selectedFile) {
    // console.log("선택된 파일:", selectedFile); // 선택된 파일 정보 출력
    // console.log("파일 객체 여부:", selectedFile instanceof Blob); // Blob 객체 여부 확인
    //     }
    // }, [selectedFile]);

    // 파일 초기화
    const handleFileReset = () => {
        setselectedFile(null);  // 파일 상태 초기화
        setProcessedFoodData([]);       // 파싱된 데이터 초기화
    }


    //excel 파일 파싱
    const readExcelFile = (selectedFile) => {

        if (!(selectedFile instanceof Blob)) {
            // console.error("올바르지 않은 파일 형식입니다.");
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
            // console.log("jsonData:",jsonData);

            //첫번째 행(헤더)를 제외하고, 두번째 행부터 매핑
            // 데이터 필터링 및 매핑
            const proceesedFoodData = jsonData.slice(1).filter(row =>
                row.every(cell => cell !== null && cell !== undefined && cell !== '') // 모든 셀 값이 null, undefined, 빈 문자열이 아닌지 체크
            ).map((row) => ({
                productName: row[0],
                price: row[1],
                consumerPrice: row[2],
                companyName: row[3],
                addressLink: row[4],
                description: row[5],
            }));

            setProcessedFoodData(proceesedFoodData);
        };

        reader.readAsArrayBuffer(selectedFile);
    };
    // 서버로 데이터 전송
    const handleSubmit = () => {
        if (proceesedFoodData.length === 0) {
            alert("파싱된 데이터가 없습니다. 파일을 올바르게 선택했는지 확인하세요.");
            return;
        }

        // 업로드 확인
        const confirmUpload = window.confirm("업로드하시겠습니까?");
        if (!confirmUpload) {
            return; // 취소하면 업로드 진행하지 않음
        }

        fetch(`${SERVER_URL}processed-foods/processed-foods-bulk-upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(proceesedFoodData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('성공:', data);
                alert('업로드가 완료되었습니다! 목록페이지로 돌아갑니다.');
                navigate('../processedFood');

            })
            .catch((error) => {
                console.error('실패:', error);
                alert('업로드 중 오류가 발생하였습니다.');
            });
    };

    // 서식파일 다운로드 함수
    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/processedFood/processed-food-template.xlsx';
        link.download = 'processed-food-template.xlsx'; // 다운로드 파일명
        link.click();
    }

    // 목록으로 돌아가기
    const handleBackToList = () => {
        navigate('../processedFood');
    };

    return (
        <div className="processed-food-upload-container">
            <h2 className="processed-food-title">가공식품정보 데이터 업로드</h2>
            {/* 상단 버튼 그룹 */}
            <div className="processed-food-button-group">
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
                    className="processed-food-button back-to-list"
                >
                    뒤로가기
                </Button>
            </div>

            {/* 파일 업로드 */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    key={selectedFile ? selectedFile.name : "file-input"}
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
            <h2 className="processed-food-upload-title">업로드된 데이터</h2>
            <div className="processed-food-price">
                <table className="processed-food-upload-table">
                    <thead className="processed-food-upload-thead">
                        <tr>
                            <th>품목명</th>
                            <th>가격</th>
                            <th>소비자가격</th>
                            <th>회사명</th>
                            <th>회사 링크</th>
                            <th>설명</th>
                        </tr>
                    </thead>
                    <tbody className="processed-food-upload-tbody">
                        {proceesedFoodData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.productName}</td>
                                <td>{row.price}</td>
                                <td>{row.consumerPrice}</td>
                                <td>{row.companyName}</td>
                                <td>{row.addressLink}</td>
                                <td>{row.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};
export default ProcessedFoodUpload;