import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import "./css/main/MainPage.css";

const MainPage = () => {
    // 이미지 슬라이더 관련 Start -----------------------------------
    const images = [
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
        "https://cdn.pixabay.com/photo/2024/11/02/05/13/winter-9168141_1280.jpg",
        "https://cdn.pixabay.com/photo/2021/11/13/23/06/tree-6792528_640.jpg",
        "https://cdn.pixabay.com/photo/2018/08/21/23/29/forest-3622519_640.jpg",
        "https://cdn.pixabay.com/photo/2024/11/08/12/05/mallard-9183253_640.jpg"
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageKey, setImageKey] = useState(0); // 이미지 키값 변경용

    const handleImageChange = (direction) => {
        const nextIndex = direction === "next"
            ? (currentIndex + 1) % images.length
            : (currentIndex - 1 + images.length) % images.length;
        setImageKey(prevKey => prevKey + 1); // key 값을 변경하여 리렌더링 강제
        setCurrentIndex(nextIndex);
    };

    // 시간 지남에 따른 자동 이미지 변경을 위한 useEffect
    useEffect(() => {
        const interval = setInterval(() => {
            handleImageChange("next");
        }, 5000); // 5초마다 변경
        
        // 컴포넌트 언마운트 시, interval 정리
        return () => clearInterval(interval);
    }, [currentIndex]);
    // 이미지 슬라이더 관련 End -------------------------------------

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
    
    // 영상 자료 관련 Start ----------------------------------------
    // 영상 자료 관련 End ------------------------------------------

    // 유관 기관 관련 Start ----------------------------------------
    const agencies = [
        {
            id: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1kKqClQE7WSUvCFd3acEPma7lFHreCibZ6A&s", // 첫 번째 이미지
        },
        {
            id: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOsH7A4fDuu0RMaMoLoF280g2dWWYmDffv7Q&s", // 두 번째 이미지
        },
        {
            id: 3,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXK4aMY8Oq-5FTXe5aobw3CzYQAGZLCFIJVA&s",
        },
        {
            id: 4,
            image: "data:image/png;base64,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",
        },
        {
            id: 5,
            image: "data:image/png;base64,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",
        },
        {
            id: 6,
            image: "data:image/jpeg;base64,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",
        },
    ];

    const [animate, setAnimate] = useState(true);
    const onStop = () => setAnimate(false);
    const onRun = () => setAnimate(true);
    // 유관 기관 관련 End ------------------------------------------

    return (
        <div className="main-container">
            <section className="top-section">
                <div className="slider-container">
                <h2>한 눈의 소식</h2>
                    <div className="single-image-slider">
                        {/* 좌측 버튼 */}
                        <button onClick={() => handleImageChange("prev")} className="slider-btn prev-btn">◀</button>

                        {/* 이미지들 */}
                        {images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`슬라이드 이미지 ${index + 1}`}
                                className={index === currentIndex ? "visible" : ""}
                            />
                        ))}

                        {/* 우측 버튼 */}
                        <button onClick={() => handleImageChange("next")} className="slider-btn next-btn">▶</button>
                    </div>
                </div>

                <div className="notice-container">
                    <h2>공지사항</h2>
                    <ul>
                        <li><Link to="/notice/1">공지사항 테스트용 기이이이이이이이이이이이이인 글</Link></li>
                        <li><Link to="/notice/2">공지사항 제목 2</Link></li>
                        <li><Link to="/notice/3">공지사항 제목 3</Link></li>
                    </ul>
                </div>

                <div className="resource-container">
                    <h2>자료실</h2>
                    <ul>
                        <li><Link to="/resources/1">자료 테스트용 기이이이이이이이이이이이이인 글</Link></li>
                        <li><Link to="/resources/2">자료 제목 2</Link></li>
                        <li><Link to="/resources/3">자료 제목 3</Link></li>
                    </ul>
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
                    <div className="video-box">
                    <Link to="/videos/1">
                        <div className="video-input">
                        <img src="video-banner1.jpg" alt="영상 배너 1" />
                        </div>
                    </Link>
                    </div>
                    <div className="video-box">
                    <Link to="/videos/2">
                        <div className="video-input">
                        <img src="video-banner2.jpg" alt="영상 배너 2" />
                        </div>
                    </Link>
                    </div>
                    <div className="video-box">
                    <Link to="/videos/3">
                        <div className="video-input">
                        <img src="video-banner3.jpg" alt="영상 배너 3" />
                        </div>
                    </Link>
                    </div>
                </div>
            </section>

            <section className="related-agencies-section">
                <div className="wrapper">
                    <div className="agency_container">
                        <ul
                            className="agency_wrapper"
                            onMouseEnter={onStop}
                            onMouseLeave={onRun}
                        >
                            <li
                                className={`agency original${animate ? "" : " stop"}`}
                            >
                                {agencies.map((s, i) => (
                                    <ul key={s.id || i}>
                                        <div className="item">
                                            <img
                                                src={s.image || "#"}  // 이미지 경로가 없다면 대체 이미지 또는 빈 값
                                                alt={`Agency ${i}`}
                                                style={{
                                                    width: "150px",
                                                    height: "50px",
                                                }}
                                            />
                                        </div>
                                    </ul>
                                ))}
                            </li>
                            <li
                                className={`agency clone${animate ? "" : " stop"}`}
                            >
                                {agencies.map((s, i) => (
                                    <ul key={s.id || i}>
                                        <div className="item">
                                            <img
                                                src={s.image || "#"}
                                                alt={`Agency ${i}`}
                                                style={{
                                                    width: "150px",
                                                    height: "50px",
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
