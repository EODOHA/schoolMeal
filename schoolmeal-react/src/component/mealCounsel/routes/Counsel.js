/*식생활 진단 페이지 이동 링크*/
import React, { useState } from 'react';
import { SERVER_URL } from '../../../Constants';
import { Button } from '@mui/material';

function CounselMain() {
    const [isIframeVisible, setIsIframeVisible] = useState(false);

    const handleButtonClick = () => {
        if (isIframeVisible) {
            // iframe이 보일 때 다시 숨기기
            const iframe = document.getElementById('counsel-iframe');
            iframe.src = ''; // src 초기화하여 로드된 페이지 비우기
            setIsIframeVisible(false);
        } else {
            // iframe이 숨겨져 있을 때만 src를 설정하고 표시
            const iframe = document.getElementById('counsel-iframe');
            iframe.src = 'https://www.foodsafetykorea.go.kr/portal/exhealthyfoodlife/index.html'; // 외부 URL
            setIsIframeVisible(true); // iframe을 보이게 설정
        }
    };

    return (
        <div>
            <h1>식생활·습관 진단 프로그램</h1>
            {/* 버튼을 감싸는 div에 flex 레이아웃 적용 */}
            <div style={{
                display: 'flex',
                justifyContent: 'center', // 버튼 수평 중앙 정렬
            }}>

                {/* iframe이 안 보일 때만 설명 텍스트 표시 */}
                {!isIframeVisible && (
                    <div style={{
                        color: '#555', // 보기 편한 색상으로 텍스트 색상 변경
                        fontSize: '16px',
                        marginBottom: '10px', // 텍스트와 버튼 사이 여백
                        textAlign: 'center'
                    }}>
                        식생활·습관 진단 프로그램을 통해 건강한 식습관을 점검해 보세요!<br />
                        아래 버튼을 클릭하여 프로그램을 시작할 수 있습니다.<br />
                        원활하게 표시가 되지 않는다면, 화면의 크기를 늘려주세요!
                    </div>
                )}


            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center', // 버튼 수평 중앙 정렬
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleButtonClick}
                >
                    {isIframeVisible ? "닫기" : "식생활 진단 페이지 열기"}
                </Button>
            </div>

            {/* 외부 페이지를 로드할 iframe */}
            <div
                id="counsel-content"
                style={{
                    display: 'flex', // flexbox 사용
                    justifyContent: 'center', // 수평 중앙 정렬
                    alignItems: 'center', // 수직 중앙 정렬
                    margin: '0 auto', // 부모 요소의 가운데 위치를 위해 자동 여백 설정
                }}
            >
                <iframe
                    id="counsel-iframe"
                    style={{
                        display: isIframeVisible ? 'block' : 'none', // iframe을 보이거나 숨기기
                        width: '100%', // 부모 컨테이너에 맞게 자동 크기 조정
                        height: '600px', // 고정 높이 설정 (원하는 만큼 조정)
                        border: '3px solid #ccc',
                        borderRadius: '8px',
                        transform: 'scale(0.9)', // 콘텐츠 크기 축소 (80%로 설정)
                        maxWidth: '100%',
                        maxHeight: '100%',
                    }}
                    title="식생활 진단 페이지"
                ></iframe>
            </div>
        </div>
    );
}

export default CounselMain;