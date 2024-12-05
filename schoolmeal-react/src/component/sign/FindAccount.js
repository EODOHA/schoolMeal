import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../Constants";
import { Stack, Button, Typography, CircularProgress, TextField, Box, InputAdornment } from "@mui/material";

const FindAccount = () => {
    const navigator = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [memberId, setMemberId] = useState('');
    const [message, setMessage] = useState('');

     // 1: 이메일 확인, 2: 토큰 입력, 3: 아이디 확인 및 비밀번호 변경, 4: 완료.
    const [step, setStep] = useState(1);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Step 변경 시 message 초기화
    useEffect(() => {
        // step이 변경될 때만 message 초기화
        if (step === 1) {
            setMessage(''); // 이메일 입력 단계
        } else if (step === 2) {
           // setMessage(''); // 토큰 입력 단계
        } else if (step === 3) {
            setMessage(''); // 아이디 확인 및 비밀번호 변경 단계
        }
    }, [step]);

    const validateEmail = () => {
        setLoading(true);
        setMessage('');

        fetch(SERVER_URL + "validate-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
        .then((res) => res.json())  // 먼저 응답을 JSON으로 변환
        .then((data) => {
            if (data.status === "banned") {
                alert("계정이 잠겼습니다! 관리자에게 문의하세요! \n메인 페이지로 이동합니다!");
                navigator("/main"); // 메인 페이지로 리디렉션
                return;
            }
            if (data.success) {
                // 이메일이 존재하면 step을 2로 변경하고 메시지 설정
                setStep(2);
                setMessage("이메일이 확인되었습니다. 인증 토큰을 발송해 주세요.");
            } else {
                setMessage(data.message || "이메일 확인 실패");
            }   
        })
        .catch((err) => {
            setMessage(err.message || "이메일 확인 중 오류가 발생했습니다.");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleSendToken = () => {
        setLoading(true);
        setMessage('');

        fetch(SERVER_URL + "find-account-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMessage("인증 토큰이 이메일로 발송되었습니다. 이메일을 확인해 주세요.");
                } else {
                    setMessage(data.message || "토큰 발송 실패");
                }
            })
            .catch((err) => {
                setMessage("토큰 발송 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleVerifyToken = () => {
        setLoading(true);
        setMessage('');

        fetch(SERVER_URL + "find-account-verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMemberId(data.memberId);
                    setStep(3); // 완료 단계로 이동
                    setMessage("인증이 완료되었습니다.");
                } else {
                    setMessage(data.message || "토큰 인증 실패");
                }
            })
            .catch((err) => {
                setMessage("인증 과정에서 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePasswordChange = () => {
        // 비밀번호 유효성 검사.
        if (!newPassword || newPassword.length < 8 || newPassword.length > 20) {
            setMessage("비밀번호는 8자 이상, 20자 이하여야 합니다.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);
        setMessage('');
        fetch(SERVER_URL + "change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ email, newPassword }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setMessage("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해 주세요.");
                setIsChangingPassword(false); // 비밀번호 변경 완료 후 초기화
                setStep(4);
            } else {
                setMessage(data.message || "비밀번호 변경 실패");
            }
        })
        .catch(() => setMessage("비밀번호 변경 중 오류가 발생했습니다."))
        .finally(() => setLoading(false));
    };

    return (
        <div
            style={{
                textAlign: "center",
                padding: "20px",
                maxWidth: "600px",
                margin: "auto",
                marginTop: "100px",
                marginBottom: "100px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                아이디 찾기 / 비밀번호 변경
            </Typography>
            {step === 1 && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                        이메일을 입력해 주세요.
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={validateEmail}
                            disabled={loading || email.length === 0}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#303f9f" },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "이메일 확인"}
                        </Button>
                    </Stack>
                </>
            )}
            {step === 2 && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                        인증 토큰을 가져와 인증해 주세요.
                    </Typography>
                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendToken}
                            disabled={loading}
                            sx={{
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                "&:hover": { backgroundColor: "#303f9f" },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "토큰 발송"}
                        </Button>
                        <TextField
                            label="인증 토큰"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleVerifyToken}
                                            disabled={loading || token.length === 0}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : "인증하기"}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </>
            )}
            {step === 3 && !isChangingPassword && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                        찾으시는 아이디는 다음과 같습니다
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                        {memberId}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigator("/")}
                            sx={{
                                backgroundColor: "#3f51b5",
                                "&:hover": { backgroundColor: "#303f9f" },
                            }}
                        >
                            로그인하기
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setIsChangingPassword(true)}
                        >
                            비밀번호 변경
                        </Button>
                    </Box>
                </>
            )}

            {step === 3 && isChangingPassword && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ color: "#666" }}>
                        새 비밀번호를 입력해 주세요.
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="새 비밀번호"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="비밀번호 확인"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePasswordChange}
                            disabled={loading || newPassword.length === 0 || confirmPassword.length === 0}
                            sx={{
                                backgroundColor: "#3f51b5",
                                "&:hover": { backgroundColor: "#303f9f" },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "비밀번호 변경"}
                        </Button>
                    </Stack>
                </>
            )}

            {step === 4 && (
                <>
                    <Stack spacing={2} sx={{ marginTop: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigator("/")} // 로그인 페이지로 리디렉션
                            sx={{
                                backgroundColor: "#3f51b5",
                                "&:hover": { backgroundColor: "#303f9f" },
                            }}
                        >
                            로그인하기
                        </Button>
                    </Stack>
                </>
            )}

            {message && (
                <Typography
                    variant="body2"
                    color={message.includes("실패") ? "error" : "primary"}
                    sx={{ marginTop: "50px", fontWeight: "bold" }}
                >
                    {message}
                </Typography>
            )}
        </div>
    );
};

export default FindAccount;