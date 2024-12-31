import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../../Constants";
import { getAccessToken } from "./kakaoApi";
import { CircularProgress } from "@mui/material";

const KakaoRedirectPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // URL에서 인증코드 추출
        const authCode = new URLSearchParams(location.search).get("code");
        // 인증코드가 확인되면 카카오 서버로부터 액세스 토큰을 요청
        if (authCode) {
            getAccessToken(authCode)
                .then(accessToken => {
                    // console.log("accessToken: ", accessToken);
                    const memberId = localStorage.getItem("memberId");
                    // console.log("localStorage에서 가져온 memberId:", localStorage.getItem("memberId"));

                    // 스프링 서버로 액세스 토큰과 아이디 전송
                    return axios.post(`${SERVER_URL}verify-kakao`,
                        {
                            token: accessToken,
                            memberId: memberId
                        });
                })
                .then(response => {
                    // console.log(response.data);
                    const { success, message } = response.data;
                    if (success) {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("memberId"); // 필요한 경우 추가 초기화

                        alert("인증이 완료되었습니다.\n로그인 선택 페이지로 이동합니다.");

                        navigate("/") // 인증 완료 후 페이지 이동

                    } else {
                        alert(message || "인증 실패: 다시 시도해 주세요.");
                        navigate("/signup"); //인증 실패 시 회원가입 페이지로 이동
                    }
                })
                .catch(error => {
                    const errorMessage = error.response?.data?.message || "인증처리 중 오류가 발생헀습니다.\n다시 시도해 주세요.";
                    // console.error("카카오 인증 오류: ", errorMessage);
                    alert(errorMessage);
                    navigate("/signup");
                })
        } else {
            alert("인증 코드가 없습니다.\n 다시 시도해 주세요.");
            navigate("/signup");
        }
    }, [location.search, navigate]);


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center', // 수평 가운데 정렬
            alignItems: 'center', // 수직 가운데 정렬
            height: '30vh' // 전체 화면 높이
        }}>
            <CircularProgress />
            <br />
            <p>카카오 인증 중입니다....⏰</p>
        </div>
    )
}
export default KakaoRedirectPage;
