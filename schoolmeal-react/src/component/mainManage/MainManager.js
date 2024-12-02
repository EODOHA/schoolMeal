import React, { useEffect, useState, useCallback } from "react";
import { Form } from "react-router-dom";
import { SERVER_URL } from "../../Constants";
import { useAuth } from "../sign/AuthContext";
import '../../css/mainManage/MainManager.css';
import LoadingSpinner from "../common/LoadingSpinner";

const MainManager = () => {
    // 카테고리 목록 상태.
    const [categories, setCategories] = useState(["header", "slider", "agency", "video"]);
    // 선택된 카테고리 상태.
    const [selectedCategory, setSelectedCategory] = useState("");
    // 이미지 목록 상태.
    const [images, setImages] = useState([]);
    // 업로드할 이미지 파일 상태.
    const [newImage, setNewImage] = useState(null);
    // 인증 관련 상태.
    const { isAuth, authCheck } = useAuth();
    // 로딩 관련 상태.
    const [loading, setLoading] = useState(true);

    // 사용자 인식 편의를 위한 이름 매핑.
    const categoryNameMapping = {
        header: "헤더",
        slider: "한 눈의 소식",
        agency: "유관 기관",
        video: "영상 자료",
    };

    useEffect(() => {
        if (authCheck) {
            return;
        }
        if (!authCheck && !isAuth) {
            window.location.href = "/unauthorized";
            return;
        }
        fetchImages();
    }, [authCheck, isAuth]);

    const token = sessionStorage.getItem("jwt");

    const createHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': token
    });

    // 카테고리별 이미지 가져오기
    const fetchImages = useCallback(async (category) => {
        if (!category) return; // 카테고리 미 선택 상태라면, API 호출하지 않음.
        setLoading(true); // 로딩 상태 시작
    
        try {
            const response = await fetch(SERVER_URL + `imageManage/${category}`, {
                method: 'GET',
                headers: createHeaders(),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setImages(data); // 이미지를 상태에 저장.
    
        } catch (error) {
            console.error("이미지 불러오기 실패:", error);
            if (error.message.includes("401")) {
                // 인증 관련 오류 처리
                alert("인증 오류: 로그인이 필요합니다.");
            } else if (error.message.includes("404")) {
                // 카테고리 관련 오류 처리
                alert("이미지 데이터를 찾을 수 없습니다.");
            } else {
                // alert("이미지 정보를 가져오는 데 문제가 발생했습니다." + error.message);
                alert("파일이 변경되어, 페이지가 새로고침 됩니다!");
            }
        } finally {
            setLoading(false); // 로딩 상태 해제.
        }
    }, [selectedCategory]); // 카테고리 변경 시마다 실행

    // 초기 로드 및 카테고리 변경 시 이미지 가져오기.
    useEffect(() => {
        if (selectedCategory) {
            fetchImages(selectedCategory);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (token) {
            fetchImages(selectedCategory);
        }
    }, [token]);

    
    // 이미지 업로드 처리 --------------------------------------------------------------------
    const handleUpload = async () => {
        // 선택한 카테고리를 쿼리 파라미터에 추가
        const urlWithCategory = `${window.location.href.split('?')[0]}?category=${selectedCategory}`;

        if (!newImage) {
            alert("업로드할 파일을 선택하세요!");
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            return;
        }
        
        // 파일 크기 확인 (50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB를 바이트로 변환.
        if (newImage.size > maxSize) {
            alert("파일 크기가 50MB를 초과할 수 없습니다.");
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            return;
        }
        
        // 파일의 MIME 타입 체크 (이미지 또는 영상만 허용).
        const mimeType = newImage.type; // MIME 타입 얻기.
        
        // 카테고리가 "video"가 아닌 경우, 이미지 파일만 업로드 가능.
        if (selectedCategory !== "video" && !mimeType.startsWith("image/")) {
            alert("해당 카테고리는 이미지 파일만 업로드 가능합니다.");
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            return;
        }
        
        // 카테고리가 "video"인 경우, 영상 파일만 업로드 가능.
        if (selectedCategory === "video" && !mimeType.startsWith("video/")) {
            alert("해당 카테고리는 영상 파일만 업로드 가능합니다.");
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            return;
        }

        // 카테고리가 "header"인 경우, 1개까지만 업로드 가능.
        if (selectedCategory === "header" && checkHeaderLimit()) {
            alert("헤더 파일은 최대 1개까지만 등록할 수 있습니다.")
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            return;
        }
        
        // 카테고리가 "video"인 경우, 3개까지만 업로드 가능.
        if (selectedCategory === "video" && checkVideoLimit()) {
            alert("영상 파일은 최대 3개까지만 등록할 수 있습니다.")
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            return;
        }
        
        const formData = new FormData();
        formData.append("file", newImage); // 백엔드의 필드명과 일치해야 함.
        formData.append("category", selectedCategory);
        
        try {
            const response = await fetch(SERVER_URL + `imageManage/${selectedCategory}`, {
                method: "POST",
                headers: {
                    'Authorization': token, // 'Authorization'만 헤더에 추가
                },
                body: formData, // Content-Type은 자동으로 multipart/form-data로 설정됨.
                
            });
            
            if (response.ok) {
                alert(`${categoryNameMapping[selectedCategory]} 파일 업로드 성공!`);
                // header 카테고리 일때만 페이지 새로고침하면서 쿼리 파라미터 유지.
                if (selectedCategory === "header") {
                    window.location.href = urlWithCategory;
                } else {
                    // 다른 카테고리일 경우, fetchImages로 목록만 갱신.
                    fetchImages(selectedCategory);
                }
            } else {
                throw new Error(`${categoryNameMapping[selectedCategory]} 파일 업로드 실패. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error(`${categoryNameMapping[selectedCategory]} 파일 업로드 실패:`, error);
        } finally {
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
            setLoading(false); // 업로드 후 로딩 해제.
        }
    };

    // 이미지 수정 처리 --------------------------------------------------------------------
    const handleEdit = async (id) => {
        // 선택한 카테고리를 쿼리 파라미터에 추가
        const urlWithCategory = `${window.location.href.split('?')[0]}?category=${selectedCategory}`;

        // 새로운 이미지 파일 선택을 위한 input 엘리먼트 생성.
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = selectedCategory === "video" ? "video/*" : "image/*"
        fileInput.click();
        
        fileInput.onchange = async (e) => {
            const newImageFile = e.target.files[0];
            if (!newImageFile) {
                setNewImage(null); // 선택된 파일명 초기화.
                resetFileInput(); // 입력 상자 초기화.
                return;
            }

            // 파일 크기 확인 (50MB)
            const maxSize = 50 * 1024 * 1024;
            if (newImageFile.size > maxSize) {
                alert("파일 크기가 50MB를 초과할 수 없습니다.");
                setNewImage(null); // 선택된 파일명 초기화.
                resetFileInput(); // 입력 상자 초기화.
                return;
            }

            // 파일의 MIME 타입 체크 (이미지 또는 영상만 허용).
            const mimeType = newImageFile.type; // MIME 타입 얻기.
            
            // 카테고리가 "video"가 아닌 경우, 이미지 파일만 업로드 가능.
            if (selectedCategory !== "video" && !mimeType.startsWith("image/")) {
                alert("해당 카테고리는 이미지 파일로만 수정 가능합니다.");
                setNewImage(null); // 선택된 파일명 초기화.
                resetFileInput(); // 입력 상자 초기화.
                return;
            }
            
            // 카테고리가 "video"인 경우, 영상 파일만 업로드 가능.
            if (selectedCategory === "video" && !mimeType.startsWith("video/")) {
                alert("해당 카테고리는 영상 파일로만 수정 가능합니다.");
                setNewImage(null); // 선택된 파일명 초기화.
                resetFileInput(); // 입력 상자 초기화.
                return;
            }

            // 수정된 이미지 업로드 처리.
            const formData = new FormData();
            formData.append("file", newImageFile);
            formData.append("category", selectedCategory);

            try {
                const response = await fetch(SERVER_URL + `imageManage/${selectedCategory}/${id}`, {
                    method: "PUT",
                    headers: {
                        'Authorization': token, // 'Authorization'만 헤더에 추가
                    },
                    body: formData,
                });
                if (response.ok) {
                    alert(`${categoryNameMapping[selectedCategory]} 파일 수정 성공!`);
                    // header 카테고리 일때만 페이지 새로고침하면서 쿼리 파라미터 유지.
                    if (selectedCategory === "header") {
                        window.location.href = urlWithCategory;
                    } else {
                        // 다른 카테고리일 경우, fetchImages로 목록만 갱신.
                        fetchImages(selectedCategory);
                    }
                } else {
                    throw new Error(`${categoryNameMapping[selectedCategory]} 파일 수정 실패. 상태 코드: ${response.status}`);
                }
            } catch (error) {
                console.error(`${categoryNameMapping[selectedCategory]} 파일 수정 실패:`, error);
            } finally {
                setNewImage(null); // 선택된 파일명 초기화.
                resetFileInput(); // 입력 상자 초기화.
                setLoading(false);
            }
        };

    };
    useEffect(() => {
        // 쿼리 파라미터에서 category 값을 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, []);
    
    // 이미지 삭제 처리 --------------------------------------------------------------------
    const handleDelete = async (id) => {
        // 선택한 카테고리를 쿼리 파라미터에 추가
        const urlWithCategory = `${window.location.href.split('?')[0]}?category=${selectedCategory}`;

        // 삭제 확인 대화 상자.
        const confirmDelete = window.confirm("해당 파일을 삭제하시겠습니까?");
        
        if (confirmDelete) {
            try {
                const response = await fetch(SERVER_URL + `imageManage/${selectedCategory}/${id}`, {
                    method: "DELETE",
                    headers: createHeaders(),
                });
                
                if (response.ok) {
                    alert(`${categoryNameMapping[selectedCategory]} 파일 삭제 성공!`);
                    // header 카테고리 일때만 페이지 새로고침하면서 쿼리 파라미터 유지.
                    if (selectedCategory === "header") {
                        window.location.href = urlWithCategory;
                    } else {
                        // 다른 카테고리일 경우, fetchImages로 목록만 갱신.
                        fetchImages(selectedCategory);
                    }
                }
            } catch (error) {
                console.error(`${categoryNameMapping[selectedCategory]} 파일 삭제 실패:`, error);
            } finally {
                setNewImage(null); // 선택된 파일명 초기화.
                resetFileInput(); // 입력 상자 초기화.
            }
        } else {
            alert(`${categoryNameMapping[selectedCategory]} 파일 삭제 취소!`);
            setNewImage(null); // 선택된 파일명 초기화.
            resetFileInput(); // 입력 상자 초기화.
        }
    };

    const checkHeaderLimit = () => {
        const headerCount = images.filter(image => image.category === 'header').length;
        return headerCount >= 1;
    }

    // 영상 파일 최대 3개 제한 함수.
    const checkVideoLimit = () => {
        const videoCount = images.filter(image => image.url && image.url.includes('video')).length;
        return videoCount >= 3;
    };

    // // 영상 썸네일 생성하는 함수.
    // const generateThumnail = (videoFile) => {
    //     return new Promise((resolve, reject) => {
    //         const videoElement = document.createElement("video");

    //         // 파일 URL을 비디오 요소에 설정.
    //         videoElement.src = URL.createObjectURL(videoFile);

    //         // 비디오 로드 완료 후, 썸네일 캡쳐.
    //         videoElement.onloadeddata = () => {
    //             // 캔버스 이용해 썸네일 추출.
    //             const canvas = document.createElement("canvas");
    //             const context = canvas.getContext("2d");

    //             // 비디오의 첫 번째 프레임을 캔버스에 그리기.
    //             context.drawImage(videoElement, 0, 0, 120, 120); // 썸네일 크기.
    //             const thumbnailUrl = canvas.toDataURL("image/png"); // 이미지 URL 생성.

    //             resolve(thumbnailUrl); // 썸네일 이미지 URL 반환.
    //         };

    //         // 비디오 로드 실패 시 처리.
    //         videoElement.onerror = (error) => reject("비디오 로드 오류: " + error);
    //     });
    // };
    
    // 이미지 목록에서 썸네일 처리하기
    const renderThumbnail = (image) => {
        // 만약 이미지가 비디오라면, 썸네일 생성.
        if (image.url && image.url.includes("video")) {
            return (
                <video
                    controls // 영상 컨트롤 바(내장 기능)
                    style={{
                        width: "200px",
                        height: "150px",
                        border: "2px solid black",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        objectFit: "cover",
                    }}
                >
                    <source 
                        src={image.url}
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            );
        }

        // 일반 이미지의 경우, 기본 이미지 썸네일 처리.
        return <img
                    src={image.url}
                    alt={image.name}
                    style={{
                        width: "150px",
                        height: "150px",
                        border: "2px solid black",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        objectFit: "cover",
                    }}
                />;
    };

    // 파일 입력 상자 초기화 함수
    const resetFileInput = () => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    }

    return (
        <div className="main-manager">
            <h1>메인 페이지 관리</h1>

            {/* 카테고리 선택 */}
            <div className="category-selector">
                <label htmlFor="category">카테고리 선택</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">선택</option> {/* 기본적으로 빈 값을 추가 */}
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {categoryNameMapping[category]}
                        </option>
                    ))}
                </select>
            </div>

            {/* 카테고리 선택 전, 안내 문구 */}
            {!selectedCategory && (
                <p style={{ 
                        marginTop: "30px",
                        color: "#555", 
                        textAlign: "center",
                        fontSize: "20px"
                    }}
                >
                    변경하고 싶은 카테고리를 선택해 주세요.
                </p>
            )}

            {/* 카테고리 선택 후에만 이미지 업로드 및 목록 섹션 보이기 */}
            {selectedCategory && (
                <>
                    {/* 이미지 업로드 */}
                    <div className="upload-section" style={{ display: selectedCategory ? 'block' : 'none' }}>
                        <h2>[{categoryNameMapping[selectedCategory]}] 파일 업로드</h2>
                        <input
                            type="file"
                            accept={selectedCategory === "video" ? "video/*" : "image/*"}
                            onChange={(e) => setNewImage(e.target.files[0])}
                        />
                        <button onClick={handleUpload}>업로드하기</button>
                    </div>


                    {/* 이미지 목록 */}
                    {loading && <LoadingSpinner />}
                    {!loading && selectedCategory && (
                        <div 
                            className="image-list" 
                            style={{ display: selectedCategory ? 'block' : 'none',}}
                        >
                            <h2>[{categoryNameMapping[selectedCategory]}] 파일 목록</h2>
                            {!loading && images.length === 0 ? (
                                <p>등록된 파일이 없습니다.</p>
                            ) : (
                                <div className="image-grid">
                                    {images.map((image) => (
                                        <div key={image.id} className="image-item">
                                            {/* 썸네일로 이미지 미리보기 */}
                                            {renderThumbnail(image)} {/* 썸네일 처리 */}

                                            <br />
                                            
                                            <span 
                                                style={{ marginLeft: "5px" }}
                                            >
                                                {image.name}
                                            </span>

                                            <br />
                                            <button onClick={() => handleEdit(image.id)}>수정</button>
                                            <button onClick={() => handleDelete(image.id)}>삭제</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MainManager;