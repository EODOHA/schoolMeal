import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { SERVER_URL } from "../../Constants";
import { Stack, Button, Typography, CircularProgress, TextField, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 사용

const ReEmailVerification = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [emailToken, setEmailToken] = useState(''); // 이메일 인증 토큰
    const [emailVerification, setEmailVerification] = useState({
        isVerified: false,
        message: ''
    });
    const { token } = useAuth();
    const navigator = useNavigate(); // 페이지 이동을 위한 hook

    // 멤버 이메일을 GET 방식으로 가져오는 함수
    const getMemberEmail = async () => {
        try {
            const response = await fetch(SERVER_URL + 'members/me', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,  // 인증된 토큰을 헤더에 첨부
                },
            });

            const data = await response.json();

            if (data.email) {
                return data.email;  // 이메일 정보 반환
            } else {
                throw new Error("이메일을 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("멤버 정보 가져오기 오류:", err);
            return null;
        }
    };

    const handleResendToken = async () => {
        // 확인 창을 통해 재발급을 요청할 지 물어봄.
        const isConfirmed = window.confirm("정말로 새로운 인증 토큰을 발급하시겠습니까?");

        if (!isConfirmed) {
            return; // 취소 시, 함수 종료.
        }

        setLoading(true); // 로딩 시작
        setMessage('');

        // 멤버 이메일 가져옴.
        const email = await getMemberEmail();

        if (!email) {
            setMessage("로그인된 사용자의 이메일을 가져올 수 없습니다.");
            setLoading(false);
            return;
        }

        // 이메일을 서버로 보내서 인증 토큰을 재발급 받음.
        fetch(SERVER_URL + 'resend-email-verification-token', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify({ email }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMessage("새로운 인증 토큰이 이메일로 발송되었습니다.");
            } else {
                setMessage(data.message || "토큰 재발급에 실패했습니다.");
            }
        })
        .catch(err => {
            console.error("토큰 재발급 요청 중 오류 발생:", err);
            setMessage("요청 중 문제가 발생했습니다. 다시 시도해 주세요.");
        })
        .finally(() => {
            setLoading(false); // 로딩 종료.
        });
    };

    const verifyEmailToken = async () => {

        // 멤버 이메일 가져옴.
        const email = await getMemberEmail();

        if (!email) {
            setMessage("로그인된 사용자의 이메일을 가져올 수 없습니다.");
            setLoading(false);
            return;
        }

        fetch(SERVER_URL + 'verify-token', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, token: emailToken })  // 이메일은 로그인된 사용자 정보에서 가져올 수 있습니다.
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setEmailVerification({
                    isVerified: true,
                    message: "이메일 인증이 완료되었습니다."
                });
                alert("이메일 인증이 완료되었습니다.\n메인 페이지로 이동합니다.");
                navigator("/main"); // 이메일 인증 성공 후 main 페이지로 이동
            } else {
                setEmailVerification({
                    isVerified: false,
                    message: "토큰 인증 실패"
                });
            }
        })
        .catch((err) => {
            setEmailVerification({
                isVerified: false,
                message: "인증 과정에서 문제가 발생했습니다."
            });
        });
    };

    return (
        <div className="reRmail-verification-form"
            style={{ 
                textAlign: "center",
                padding: "20px", 
                maxWidth: "600px", 
                margin: "auto", 
                marginTop: "100px",
                marginBottom: "100px",
                borderRadius: "8px", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
                backgroundColor: "#f9f9f9" 
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                이메일 인증
            </Typography>
            <br/>
            <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                토큰 정보를 알고 있다면 바로 입력하시고,
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                모른다면 토큰 재발급을 눌러주세요.
            </Typography>
            <br/>
            <Stack spacing={2} alignItems="center">
                <TextField
                    label="이메일 인증 토큰"
                    name="emailToken"
                    value={emailToken}
                    onChange={(e) => setEmailToken(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ borderRadius: "8px" }}
                />
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={verifyEmailToken}
                        disabled={loading || emailToken.length === 0} // 토큰이 없으면 인증하기 버튼 비활성화
                        fullWidth
                        sx={{
                            backgroundColor: "#3f51b5",
                            color: "#fff",
                            '&:hover': {
                                backgroundColor: "#303f9f",
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "인증하기"}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleResendToken}
                        disabled={loading}
                        fullWidth
                        sx={{
                            borderColor: "#f50057",
                            color: "#f50057",
                            '&:hover': {
                                borderColor: "#d40047",
                                color: "#d40047",
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "토큰 재발급"}
                    </Button>
                </Box>

                {emailVerification.message && (
                    <Typography
                        variant="body2"
                        color={emailVerification.isVerified ? "green" : "red"}
                        sx={{ marginTop: "10px", fontWeight: "bold" }}
                    >
                        {emailVerification.message}
                    </Typography>
                )}
                {message && (
                    <Typography variant="body2" color={message.includes("실패") ? "error" : "primary"} sx={{ marginTop: "10px", fontWeight: "bold" }}>
                        {message}
                    </Typography>
                )}
            </Stack>
        </div>
    );
};

export default ReEmailVerification;
