import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../../Constants";
import LoadingSpinner from "../../common/LoadingSpinner";
import HaccpInfoEdit from "../edits/HaccpInfoEdit";
import { useAuth } from "../../sign/AuthContext";
import HaccpInfoWrite from "../writes/HaccpInfoWrite";
import WriteFileUpload from "../writes/WriteFileUpload";
import { useNavigate } from "react-router-dom";

const HaccpInfoList = () => {
    const [haccpList, setHaccpList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedHaccp, setSelectedHaccp] = useState(null);
    const [isWriting, setIsWriting] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    // 데이터 목록 가져오기
    const fetchHaccpData = () => {
        fetch(`${SERVER_URL}haccp`)
            .then((response) => response.json())
            .then((data) => {
                // 데이터를 최신순으로 내림차순 정렬
                const sortedData = data._embedded.haccpInfoes.sort((a, b) => {
                    const aId = parseInt(a._links.self.href.split("/").pop(), 10);
                    const bId = parseInt(b._links.self.href.split("/").pop(), 10);
                    return bId - aId; // 최신순으로 정렬
                });
                setHaccpList(sortedData || []);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching HACCP data:", error));
    };

    useEffect(() => {
        fetchHaccpData();
    }, []);

    const handleDelete = (haccpId) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        fetch(`${SERVER_URL}haccp/${haccpId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setHaccpList(haccpList.filter((haccp) => haccp._links.self.href.split("/").pop() !== haccpId));
                alert("삭제되었습니다.");
            })
            .catch((error) => {
                console.error("삭제 오류:", error);
                alert("삭제 중 오류가 발생했습니다.");
            });
    };

    const handleEdit = (haccp) => {
        setSelectedHaccp(haccp);    //수정할 데이터를 선택
        setEditMode(true);  //수정 모드 활성화
    }

    const handleWriteClick = () => {
        setIsWriting(true);
    }
    const handleUploadClick = () => {
        navigate("/haccp-info/write-file-upload");

    }

    if (loading) {
        return <div><LoadingSpinner /></div>;
    }

    return (
        <div>
            <h1>HACCP 인증 정보</h1>
            {!isWriting && (
                <>
                    <button onClick={handleWriteClick}>정보 등록하기</button>
                    <button onClick={handleUploadClick}>대용량 업로드하기</button>
                </>
            )}
            {isWriting ? (
                <HaccpInfoWrite setIsWriting={setIsWriting} fetchHaccpData={fetchHaccpData} />
            ) : editMode ? (
                <HaccpInfoEdit
                    haccp={selectedHaccp}
                    setEditMode={setEditMode}
                    setHaccpList={setHaccpList}
                />
            ) : haccpList.length === 0 ? (
                <div>
                    <p>등록된 HACCP 인증 정보가 없습니다.</p>
                    <p>새로운 정보를 등록해 주세요.</p>
                </div>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>HACCP 지정번호</th>
                            <th>카테고리</th>
                            <th>업소명</th>
                            <th>주소</th>
                            <th>품목명</th>
                            <th>영업상태</th>
                            <th>인증종료일자</th>
                            <th>수정</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {haccpList.map((haccp, index) => {
                            const haccpId = haccp._links.self.href.split("/").pop(); // ID 추출
                            return (
                                <tr key={haccpId}>
                                    <td>{index + 1}</td>
                                    <td>{haccp.haccpDesignationNumber}</td>
                                    <td>{haccp.category}</td>
                                    <td>{haccp.businessName}</td>
                                    <td>{haccp.address}</td>
                                    <td>{haccp.productName}</td>
                                    <td>{haccp.businessStatus}</td>
                                    <td>{haccp.certificationEndDate}</td>
                                    <td>
                                        <button onClick={() => handleEdit(haccp)}>Edit</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(haccpId)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HaccpInfoList;