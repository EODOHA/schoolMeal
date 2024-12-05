import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Stack, Box } from "@mui/material";
import { SERVER_URL } from "../../Constants";

const EmailVerification = () => {
    const location = useLocation();
    const navigator = useNavigate();

    const [emailToken, setEmailToken] = useState('');
    const [emailVerification, setEmailVerification] = useState({
        isVerified: false,
        message: '',
    });

    const { email } = location.state.member;

    const verifyEmailToken = () => {
        fetch(SERVER_URL + 'verify-token', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token: emailToken })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setEmailVerification({
                    isVerified: true,
                    message: "이메일 인증이 완료되었습니다."
                });
                alert("이메일 인증이 완료되었습니다.\n로그인 선택 페이지로 이동합니다.")
                navigator("/"); // 이메일 인증 성공 후 main 페이지로 이동
                
            } else {
                setEmailVerification({
                    isVerified: false,
                    message: data.message || "토큰 인증 실패"
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
        <div className="email-verification-form"
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
            <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                토큰이 발송되었습니다.
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                이메일을 확인하여 토큰을 입력해 주세요.
            </Typography>
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
                        fullWidth
                        sx={{
                            backgroundColor: "#3f51b5",
                            color: "#fff",
                            '&:hover': {
                                backgroundColor: "#303f9f",
                            },
                        }}
                    >
                        인증하기
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
            </Stack>
        </div>
    );
};

export default EmailVerification;