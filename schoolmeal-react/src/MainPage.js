import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import "./css/main/MainPage.css";
import { SERVER_URL } from "./Constants";
import { useNavLinks } from "./component/layout/NavLinksContext";
import ChatApp from "./ChatApp";

const MainPage = () => {
    const [images, setImages] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageKey, setImageKey] = useState(0); // 이미지 키값 변경용
    const [adminNotices, setAdminNotices] = useState([]);
    const [resources, setResources] = useState([]); // 급식 자료실 목록
    
    // 각각의 로딩 상태 추가
    const [isImagesLoading, setIsImagesLoading] = useState(true);
    const [isAgenciesLoading, setIsAgenciesLoading] = useState(true);
    const [isVideosLoading, setIsVideosLoading] = useState(true);
    const [isAdminNoticeLoading, setIsAdminNoticeLoading] = useState(true);
    const [isResourcesLoading, setIsResourcesLoading] = useState(true); // 로딩 상태

    const token = sessionStorage.getItem("jwt");

    const { selectedParent } = useNavLinks();

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

    // 메인 공지사항 목록 가져오기 ----------------------------------------
    useEffect(() => {
        setIsAdminNoticeLoading(true);
        fetch(SERVER_URL + 'adminNotice', {
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
            console.log("Fetched adminNotices:", data); // 확인용 로그
            setAdminNotices(data); // 데이터를 그대로 저장
            setIsAdminNoticeLoading(false);
        })
        .catch((error) => console.error("Error fetching adminNotices:", error))
        .finally(() => setIsAdminNoticeLoading(false));
    }, []); // 컴포넌트 마운트 시 한 번만 실행.

    // 학교급식 우수사례 목록을 가져오기 ------------------------------------
    useEffect(() => {
        setIsResourcesLoading(true);
        fetch(SERVER_URL + 'schoolMealCases', {
            method: 'GET',
            headers: createHeaders(),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched Resource:", data);
            setResources(data._embedded?.schoolMealCases || []);  // 데이터가 없으면 빈 배열로 설정
            setIsResourcesLoading(false);  // 로딩 완료 상태로 설정
        })
        .catch((error) => {
            console.error("Error fetching Resources:", error);
            setIsResourcesLoading(false);  // 로딩 실패 상태로 설정
        });
    }, []); // 컴포넌트가 마운트될 때 한 번만 실행


    // 자주 찾는 서비스 관련 Start ----------------------------------
    const sliderRef = useRef(null);
    const [position, setPosition] = useState(0);
    const itemWidth = 220; // 슬라이드 버튼 누를 때 움직이는 길이.
    const [items, setItems] = useState([]);

    const [sliderWidth, setSliderWidth] = useState(0);

    // 화면 크기 변경 시 슬라이더 너비 업데이트
    useEffect(() => {
        const handleResize = () => {
            if (sliderRef.current) {
                setSliderWidth(sliderRef.current.clientWidth); // 슬라이더 부모의 너비 계산
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 로딩 시에도 슬라이더 너비 계산

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const totalItemsWidth = items.length * itemWidth; // 전체 아이템 너비

    // 로컬 스토리지에서 항목 불러오기
    useEffect(() => {
        const savedItems = sessionStorage.getItem('favoriteServices');
        if (savedItems) {
            setItems(JSON.parse(savedItems));
        }
    }, []);

    // selectedParent가 변경될 때마다 실행
    useEffect(() => {
        if (selectedParent && selectedParent.label) {
            setItems((prevItems) => {
                // 중복된 항목이 없으면 추가
                if (!prevItems.some((item) => item.name === selectedParent.label)) {
                    const newItems = [
                        ...prevItems,
                        { 
                            id: prevItems.length + 1, 
                            name: selectedParent.label, 
                            description1: `${selectedParent.label} 관련`,
                            description2: '메인 게시판으로 이동합니다.',
                            path: selectedParent.path || '#', // selectedParent.path를 item에 추가
                        }
                    ];

                    // 새로운 항목을 로컬 스토리지에 저장
                    sessionStorage.setItem('favoriteServices', JSON.stringify(newItems));
                    return newItems;
                }
                return prevItems;  // 중복된 항목은 그대로 유지
            });
        }
    }, [selectedParent]);  // selectedParent만 의존성에 추가

    // 무한 루프 효과를 위한 useEffect
    useEffect(() => {
        if (totalItemsWidth > sliderWidth) {
            // 슬라이드가 끝에 도달했을 때, 즉시 복사된 아이템을 추가
            if (position >= (items.length - 1) * itemWidth) {
                setItems((prevItems) => [
                    ...prevItems,  // 기존 아이템들
                    ...prevItems.slice(0, items.length),  // 처음부터 items.length 만큼 복사
                ]);
            } else if (position < 0) {
                // 왼쪽 끝에 도달했을 때, 즉시 복사된 아이템을 추가
                setItems((prevItems) => [
                    ...prevItems.slice(-items.length),  // 마지막 items.length 만큼 복사
                    ...prevItems,  // 기존 아이템들
                ]);
                setPosition(items.length * itemWidth); // 위치 재조정
            }
        } else {
            // 무한 루프를 끄는 로직
            setPosition(0); // 슬라이드 초기화
        }
    }, [position, items.length, sliderWidth, totalItemsWidth]);

    // 슬라이드 이동 처리 함수
    const handleSlide = (direction) => {
        if (totalItemsWidth > sliderWidth) {  // 무한 슬라이드 조건
            const newPosition = position + direction * itemWidth;

            if (newPosition >= 0 && newPosition <= (items.length - 1) * itemWidth) {
                setPosition(newPosition);
            } else {
                // 끝에 도달하면 복사된 아이템을 즉시 추가하고 슬라이드를 0으로 리셋
                setPosition(0);  // 최소 위치로 설정

                setItems((prevItems) => [
                    ...prevItems,  // 기존 아이템들
                    ...prevItems.slice(0, items.length),  // 복사된 아이템들
                ]);
            }
        } else {
            // 슬라이드가 끝에 도달한 경우
            const newPosition = position + direction * itemWidth;

            if (newPosition >= 0 && newPosition <= (items.length - 1) * itemWidth) {
                setPosition(newPosition);
            }
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
                    ) : (
                        <div className="single-image-slider">
                            {/* 좌측 버튼 */}
                            <button onClick={() => handleImageChange("prev")} className="slider-btn prev-btn">◀</button>

                            {/* 이미지 표시 또는 자료 없음 메시지 */}
                            {images.length > 0 ? (
                                images.map((image, index) => (
                                    <img
                                        key={image.id} // id를 key로 사용.
                                        src={image.url} // 서버서 전달받은 url 사용.
                                        alt={image.name || `슬라이드 이미지 ${index + 1}`}
                                        className={index === currentIndex ? "visible" : ""}
                                        onClick={() => openModal(index)} // 클릭 시 팝업 열기.
                                    />
                                ))
                            ) : (
                                <p>이미지 자료가 없습니다. 🧐</p> // 데이터가 없을 때 표시될 메시지
                            )}
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
                    <Link to={'/adminNoticeManager'}>
                        <h2>공지사항</h2>
                    </Link>
                    <ul>
                        {isAdminNoticeLoading ? (
                        <p>로딩 중입니다... ⏳</p>
                    ) : (
                        <ul>
                            {adminNotices.length > 0 ? (
                                // 역순 출력 위해 .reverse() 사용.
                                // 복사본을 생성한 뒤 reverse() 사용
                                // 개수 제한 .slice(x, y) 사용
                                [...adminNotices].reverse().slice(0, 10).map((adminNotices) => (
                                    <li key={adminNotices.id}>
                                        <Link to={`/adminNoticeManager/detail/${adminNotices.id}`}>
                                            {adminNotices.title} {/* title을 올바르게 출력 */}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p>자료가 없습니다. 🧐</p> // 데이터가 없을 때 표시될 메시지
                            )}
                        </ul>
                    )}
                    </ul>
                </div>

                <div className="resource-container">
                    <Link to={'/mealResource/school-meal-case'}>
                        <h2>학교급식 우수사례</h2>
                    </Link>
                    <ul>
                        {isResourcesLoading ? (
                            <p>로딩 중입니다... ⏳</p>
                        ) : (
                            <ul>
                                {resources.length > 0 ? (
                                    // 역순 출력 위해 .reverse() 사용.
                                    // 복사본을 생성한 뒤 reverse() 사용
                                    // 개수 제한 .slice(x, y) 사용
                                    [...resources].reverse().slice(0, 10).map((resource) => ( // 변수 이름 변경
                                        <li key={resource.id}>
                                            <Link to={`/mealResource/school-meal-case/${resource.id}`}>
                                                {resource.title} {/* title을 올바르게 출력 */}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <p>자료가 없습니다. 🧐</p> // 데이터가 없을 때 표시될 메시지
                                )}
                            </ul>
                        )}
                    </ul>
                </div>
            </section>

            <ChatApp></ChatApp>

            <section className="service-section">
                <h2>자주 찾는 서비스</h2>
                <div className="service-slider-wrapper">
                    <button 
                        className="slider-btn prev-btn" 
                        onClick={() => handleSlide(-1)}
                    >
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
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <Link to={item.path || '#'} className="service-link">
                                    <div key={`${item.id}-${index}`} className="service-item">
                                    {/* react-router-dom의 Link 컴포넌트를 사용하여 href 대신 path로 이동 */}
                                        <h3>{item.name}</h3>
                                        <p>{item.description1}</p>
                                        <p>{item.description2}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p style={{marginLeft: "70px"}}>아직 방문한 게시판이 없습니다. 🧐</p>
                        )}
                    </div>
                    <button 
                        className="slider-btn next-btn" 
                        onClick={() => handleSlide(1)}
                    >
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
                            {/* 로딩 중일 때 */}
                            {isAgenciesLoading ? (
                                <p>로딩 중입니다... ⏳</p>
                            ) : (
                                <>
                                    {/* 자료가 없을 때 */}
                                    {agencies.length === 0 ? (
                                        <p>유관기관 자료가 없습니다. 🧐</p>
                                    ) : (
                                        <>
                                            {/* 원본 리스트 */}
                                            <li className={`agency original${animate ? "" : " stop"}`}>
                                                {agencies.map((s, i) => (
                                                    <ul key={s.id || i}>
                                                        <div className="item">
                                                            <img
                                                                src={s.url || "#"} // 이미지 경로가 없다면 대체 이미지 또는 빈 값
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
                                            <li className={`agency clone${animate ? "" : " stop"}`}>
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
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MainPage;
