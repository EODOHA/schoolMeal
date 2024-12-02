import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import "./css/main/MainPage.css";
import { SERVER_URL } from "./Constants";
import axios from 'axios';
import LoadingSpinner from "./component/common/LoadingSpinner";

const MainPage = () => {
    const [images, setImages] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageKey, setImageKey] = useState(0); // 이미지 키값 변경용
    const [resources, setResources] = useState([]); // 급식 자료실 목록
    
    // 각각의 로딩 상태 추가
    const [isImagesLoading, setIsImagesLoading] = useState(true);
    const [isAgenciesLoading, setIsAgenciesLoading] = useState(true);
    const [isVideosLoading, setIsVideosLoading] = useState(true);
    const [isResourcesLoading, setIsResourcesLoading] = useState(true); // 로딩 상태

    const token = sessionStorage.getItem("jwt");

    const createHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': token
    });

    // 한 눈의 소식 정보 불러오기 -----------------------------------------------------------
    useEffect(() => {
        setIsImagesLoading(true); // 로딩 시작.
        fetch(SERVER_URL + 'imageManage/slider', {
            method: 'GET',
            headers: createHeaders(),
        })
            .then(response => {
                // 응답 상태 코드가 200번이 아니면, 에러 던짐.
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // JSON으로 응답을 파싱.
            })
            .then(data => {
                console.log("Fetched images:", data); // 확인용 로그
                setImages(data); // 데이터를 그대로 저장
            })
            .catch((error) => console.error("Error fetching images:", error))
            .finally(() => setIsImagesLoading(false)); // 로딩 끝.
    }, []); // 컴포넌트 마운트 시 한 번만 실행.

    // 이 코드 없으면 자동 슬라이드 시, 이미지 없어짐.
    useEffect(() => {
        if (images.length > 0) {
            // 이미지가 있을 경우, 슬라이더를 자동으로 변경
            handleImageChange("next");
        }
    }, [images]); // images가 변경될 때마다 실행

    // 유관 기관 정보 불러오기 ---------------------------------------------------------------
    useEffect(() => {
        setIsAgenciesLoading(true);
        fetch(SERVER_URL + 'imageManage/agency', {
            method: 'GET',
            headers: createHeaders(),
        })
            .then(response => {
                // 응답 상태 코드가 200번이 아니면, 에러 던짐.
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // JSON으로 응답을 파싱.
            })
            .then(data => {
                console.log("Fetched agencies:", data); // 확인용 로그
                setAgencies(data); // 데이터를 그대로 저장
            })
            .catch((error) => console.error("Error fetching agencies:", error))
            .finally(() => setIsAgenciesLoading(false));
    }, []); // 컴포넌트 마운트 시 한 번만 실행.

    // 영상 자료 정보 불러오기 --------------------------------------------------------------
    useEffect(() => {
        setIsVideosLoading(true);
        fetch(SERVER_URL + 'imageManage/video', {
            method: 'GET',
            headers: createHeaders(),
        })
            .then(response => {
                // 응답 상태 코드가 200번이 아니면, 에러 던짐.
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // JSON으로 응답을 파싱.
            })
            .then(data => {
                console.log("Fetched videos:", data); // 확인용 로그
                setVideos(data); // 데이터를 그대로 저장
            })
            .catch((error) => console.error("Error fetching videos:", error))
            .finally(() => setIsVideosLoading(false));
    }, []); // 컴포넌트 마운트 시 한 번만 실행.

    // 한 눈의 소식 이미지 팝업 관련 상태. --------------------------------------------------
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(""); // 팝업에 표시할 이미지.

    const handleImageChange = (direction) => {
        const nextIndex = direction === "next"
            ? (currentIndex + 1) % images.length
            : (currentIndex - 1 + images.length) % images.length;
        setImageKey(prevKey => prevKey + 1); // key 값을 변경하여 리렌더링 강제.
        setCurrentIndex(nextIndex);
    };

    // 이미지 클릭 시 팝업 열기
    const openModal = (index) => {
        const image = images[currentIndex]; // 클릭된 인덱스를 통해 이미지 URL 찾음.
        setModalImage(image.url); // 클릭한 이미지의 URL을 상태에 저장.
        setShowModal(true); // 팝업 띄우기 위한 상태 업데이트.
    };

    // 팝업 위치 조절용
    useLayoutEffect(() => {
        if (showModal) {
            const modalElement = document.querySelector('.modal-content');
            if (modalElement) {
                // 팝업을 화면 중앙에 위치시키기 위한 계산.
                const scrollPosition = window.scrollY; // 현재 스크롤 위치.
                const screenHeight = window.innerHeight; // 화면 높이
                const modalHeight = modalElement.offsetHeight; // 팝업의 높이.

                // 팝업 위치를 중간으로 계산.
                const modalTop = scrollPosition + (screenHeight - modalHeight) / 2;

                // 팝업에 해당 위치를 스타일로 적용.
                modalElement.style.position = 'fixed'; // fixed로 위치 설정
                modalElement.style.top = `${modalTop}px`;
                modalElement.style.left = '50%'; // 수평 중앙
                modalElement.style.transform = 'translateX(-50%) scale(1.5)'; // 수평 중앙 정렬
            }
        }
    }, [showModal]);

    // 이미지 팝업 닫기
    const closeModal = () => {
        setShowModal(false); // 팝업 닫기 위한 상태 업데이트.
        setModalImage(""); // modalImage 초기화.
    };

    // 영상 팝업 상태 추가.
    const [showVideoModal, setShowVideoModal] = useState(false); // 비디오 팝업 표시 여부.
    const [modalVideoUrl, setModalVideoUrl] = useState(""); // 팝업에 표시할 비디오 URL

    // 영상 클릭 시 팝업 열기.
    const openVideoModal = (url) => {
        setModalVideoUrl(url); // 클릭된 비디오의 URL을 저장.
        setShowVideoModal(true);
    }

    // 영상 팝업 닫기.
    const closeVideoModal = () => {
        setShowVideoModal(false); // 팝업 닫기.
        setModalVideoUrl(""); // URL 초기화.
    }

     // 비디오 팝업 위치 조정용
     useLayoutEffect(() => {
        if (showVideoModal) {
            const modalElement = document.querySelector('.video-modal-content');
            if (modalElement) {
                const scrollPosition = window.scrollY; // 현재 스크롤 위치
                const screenHeight = window.innerHeight; // 화면 높이
                const modalHeight = modalElement.offsetHeight; // 팝업의 높이

                // 팝업 위치를 중간으로 계산
                const modalTop = scrollPosition + (screenHeight - modalHeight) / 2;

                // 팝업에 해당 위치를 스타일로 적용
                modalElement.style.position = 'fixed'; // fixed로 위치 설정
                modalElement.style.top = `${modalTop}px`;
                modalElement.style.left = '50%'; // 수평 중앙
                modalElement.style.transform = 'translateX(-50%)'; // 수평 중앙 정렬
            }
        }
    }, [showVideoModal]);

    // 시간 지남에 따른 자동 이미지 변경을 위한 useEffect
    useEffect(() => {
        // 파일이 1개일 경우, 슬라이드 변경 안 함.
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            handleImageChange("next");
        }, 5000); // 5초마다 변경
        
        // 컴포넌트 언마운트 시, interval 정리
        return () => clearInterval(interval);
    }, [currentIndex]);

    // 급식자료실 목록을 가져오기 ------------------------------------
    useEffect(() => {
        setIsResourcesLoading(true);
        axios.get(`${SERVER_URL}mealPolicyOperations`) // 급식 자료 API 엔드포인트
            .then(response => {
                // 실제 자료는 response.data._embedded.mealPolicyOperations에 있음
                setResources(response.data._embedded.mealPolicyOperations); // 급식 자료 목록 업데이트
                setIsResourcesLoading(false); // 데이터 로딩 완료
            })
            .catch((error) => console.error("급식 자료 로딩 실패", error))
            .finally(() => setIsResourcesLoading(false));
    }, []);

    // 자주 찾는 서비스 관련 Start ----------------------------------
    const sliderRef = useRef(null);
    const [position, setPosition] = useState(0);
    const itemWidth = 270;
    const [items, setItems] = useState([
        { id: 1, name: "서비스 1", description: "서비스 1 설명" },
        { id: 2, name: "서비스 2", description: "서비스 2 설명" },
        { id: 3, name: "서비스 3", description: "서비스 3 설명" },
        { id: 4, name: "서비스 4", description: "서비스 4 설명" },
        { id: 5, name: "서비스 5", description: "서비스 5 설명" },
        { id: 6, name: "서비스 6", description: "서비스 6 설명" },
        { id: 7, name: "서비스 7", description: "서비스 7 설명" },
        { id: 8, name: "서비스 8", description: "서비스 8 설명" },
    ]);

    // 무한 루프 효과를 위한 useEffect
    useEffect(() => {
        if (position > (items.length - 8) * itemWidth) {
            // 오른쪽으로 끝에 도달한 경우
            setItems((prevItems) => [
                ...prevItems.slice(0, 8), // 처음 8개 항목
                ...prevItems, // 나머지 항목
            ]);
        } else if (position < 0) {
            // 왼쪽으로 끝에 도달한 경우
            setItems((prevItems) => [
                ...prevItems.slice(-8), // 마지막 8개 항목
                ...prevItems, // 나머지 항목
            ]);
            setPosition(8 * itemWidth); // 위치 재조정
        }
    }, [position]);
    
    // 슬라이드 이동 처리 함수 (부드럽게 이동하도록 설정)
    const handleSlide = (direction) => {
        const newPosition = position + direction * itemWidth;
        if (newPosition >= 0) {
            setPosition(newPosition);
        } else {
            setPosition(0); // 최소 위치로 설정
        }
    };
    // 자주 찾는 서비스 관련 End ------------------------------------

    // 유관 기관 관련 Start ----------------------------------------
    const [animate, setAnimate] = useState(true);
    const onStop = () => setAnimate(false);
    const onRun = () => setAnimate(true);
    // 유관 기관 관련 End ------------------------------------------

    return (
        <div className="main-container">
            <section className="top-section">
                <div className="slider-container">
                <h2>한 눈의 소식</h2>
                {isImagesLoading ? (
                    <p>로딩 중입니다... ⏳</p>
                    ): (
                    <div className="single-image-slider">
                        {/* 좌측 버튼 */}
                        <button onClick={() => handleImageChange("prev")} className="slider-btn prev-btn">◀</button>

                        {/* 이미지들 */}
                        {images.map((image, index) => (
                            <img
                            key={image.id} // id를 key로 사용.
                            src={image.url} // 서버서 전달받은 url 사용.
                            alt={image.name || `슬라이드 이미지 ${index + 1}`}
                            className={index === currentIndex ? "visible" : ""}
                            onClick={() => openModal(index)} // 클릭 시 팝업 열기.
                            />
                        ))}

                        {/* 우측 버튼 */}
                        <button onClick={() => handleImageChange("next")} className="slider-btn next-btn">▶</button>
                    </div>
                    )}
                </div>
                    
                {/* 이미지 팝업 모달 */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content">
                            <button className="modal-close-btn" onClick={closeModal}>X</button>
                            <img src={modalImage} alt="Selected Image" className="modal-image"></img>
                        </div>
                    </div>
                )}

                <div className="notice-container">
                    <h2>공지사항</h2>
                    <ul>
                        <li><Link to="/notice/1">공지사항 테스트용 기이이이이이이이이이이이이이이이이이이이이이이이이이이이이인 글</Link></li>
                        <li><Link to="/notice/2">공지사항 제목 2</Link></li>
                        <li><Link to="/notice/3">공지사항 제목 3</Link></li>
                    </ul>
                </div>

                <div className="resource-container">
                    <h2>급식 자료실</h2>
                    {isResourcesLoading ? (
                        <p>로딩 중입니다... ⏳</p>
                    ) : (
                        <ul>
                            {resources.length > 0 ? (
                                // 처음 5개만 보여주기 위해 slice(0, 5) 사용
                                resources.slice(0, 5).map((resource) => (
                                    <li key={resource.id}>
                                        <Link to={`/mealResource/meal-policy-operation/${resource.id}`}>
                                            {resource.title} {/* title을 올바르게 출력 */}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p>자료가 없습니다.</p> // 데이터가 없을 때 표시될 메시지
                            )}
                        </ul>
                    )}
                </div>
            </section>

            <section className="service-section">
                <h2>자주 찾는 서비스</h2>
                <div className="service-slider-wrapper">
                    <button className="slider-btn prev-btn" onClick={() => handleSlide(-1)} disabled={position === 0} >
                        ◀
                    </button>
                    <div
                        className="service-slider"
                        ref={sliderRef}
                        style={{ 
                            transform: `translateX(-${position}px)`,
                            transition: "transform 0.5s ease",
                        }} // 부드러운 전환 추가
                    >
                        {items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="service-item">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                    <button className="slider-btn next-btn" onClick={() => handleSlide(1)}>
                        ▶
                    </button>
                </div>
            </section>

            <section className="video-root-box">
                <h2>영상 자료</h2>
                <div className="video-banner">
                    {isVideosLoading ? ( // 로딩 중 상태
                        <p>로딩 중입니다... ⏳</p>
                    ) : videos.length > 0 ? ( // 영상 자료가 있을 경우
                        videos.map((video, index) => (
                            <div key={video.id || index} className="video-box">
                                <div className="video-input">
                                    {/* 비디오 썸네일 */}
                                    <video
                                        width="100%"
                                        height="100%"
                                        controls
                                        onClick={() => openVideoModal(video.url)} // 클릭 시 팝업 열기
                                    >
                                        <source src={video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        ))
                    ) : ( // 영상 자료가 없을 경우
                        <p>영상 자료가 없습니다. 🧐</p>
                    )}
                </div>
            </section>
            {showVideoModal && (
                <div className="modal-overlay" onClick={closeVideoModal}>
                    <div className="video-modal-content">
                            <video
                                width="90%"
                                height="90%"
                                controls
                                autoPlay
                            >
                            <source src={modalVideoUrl} type="video/mp4" />
                            </video>
                        <button className="modal-close-btn" onClick={closeVideoModal}>X
                        </button>
                    </div>
                </div>
            )}

            <section className="related-agencies-section">
                <div className="wrapper">
                    <div className="agency_container">
                        <ul
                            className="agency_wrapper"
                            onMouseEnter={onStop}
                            onMouseLeave={onRun}
                        >
                            {/* 원본 리스트 */}
                            <li
                                className={`agency original${animate ? "" : " stop"}`}
                            >
                                {agencies.map((s, i) => (
                                    <ul key={s.id || i}>
                                        <div className="item">
                                            <img
                                                src={s.url || "#"}  // 이미지 경로가 없다면 대체 이미지 또는 빈 값
                                                alt={s.name || `Agency ${i}`}
                                                style={{
                                                    width: "200px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </div>
                                    </ul>
                                ))}
                            </li>

                            {/* 복제된 리스트 (애니메이션 용도) */}
                            <li
                                className={`agency clone${animate ? "" : " stop"}`}
                            >
                                {agencies.map((s, i) => (
                                    <ul key={`${s.id || i}-clone`}>
                                        <div className="item">
                                            <img
                                                src={s.url || "#"}
                                                alt={s.name || `Agency Clone ${i}`}
                                                style={{
                                                    width: "200px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </div>
                                    </ul>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MainPage;
