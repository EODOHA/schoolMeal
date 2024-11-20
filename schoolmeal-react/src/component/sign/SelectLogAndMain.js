import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import "../../css/sign/SelectLogAndMain.css";

function SelectLogAndMain() {
    const navigate = useNavigate();
    const [showButtons, setShowButtons] = useState(false);
    const [animate, setAnimate] = useState(false);

    const handleGuestLogin = () => {
        const isConfirm = window.confirm(
            "정말 비로그인으로 접속하시겠습니까? \n이용에 일부 제한이 있을 수 있습니다."
        )
        if (isConfirm) {

            navigate("/main");
        } else {
            return;
        }
    }

    const handleLoginRedirect = (type) => {
        // 로그인 타입에 맞는 URL로 이동.
        navigate(`/login?type=${type}`)
    };

    // 버튼 출력 시간 지연.
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButtons(true);
            setAnimate(true);
        }, 100);
        // 컴포넌트 언마운트 시, 타이머 정리.
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box className="outer-container">
            <Box className="centered-container">
                <Box className="logo-container">
                    <Box display="flex" alignItems="center">
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="logo"
                        />
                        <span className="logo-text">학교급식 통합 플랫폼 스쿨밀</span>
                    </Box>
                </Box>

                <Box mb={4}>
                    <img
                        src="./selectLogAndMain/background_img.jpg"
                        alt="main image"
                    />
                </Box>

                {showButtons && (
                    <Stack
                        spacing={3}
                        direction="row"
                        alignItems="center"
                        className="button-show-fadeIn"
                    >
                        <Button variant="contained" onClick={() => handleLoginRedirect('member')} className="member button-image-container">
                            일반회원
                            <img src="./selectLogAndMain/member.png" alt="일반회원" className="button-image" />
                        </Button>
                        <Button variant="contained" onClick={() => handleLoginRedirect('linkage')} className="linkage button-image-container">
                            연계회원
                            <img src="./selectLogAndMain/linkage.png" alt="연계회원" className="button-image" />
                        </Button>
                        <Button variant="contained" onClick={() => handleLoginRedirect('admin')} className="admin button-image-container">
                            관리자
                            <img src="./selectLogAndMain/admin.png" alt="관리자" className="button-image" />
                        </Button>
                        <Button variant="outlined" onClick={handleGuestLogin} className="guest button-image-container">
                            비로그인
                            <img src="./selectLogAndMain/guest.png" alt="비로그인" className="button-image" />
                        </Button>
                    </Stack>
                )}
            </Box>
        </Box>
    );
}

export default SelectLogAndMain;
