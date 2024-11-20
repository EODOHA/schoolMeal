import React, { useState } from "react";
import { SERVER_URL } from "../../Constants";
import { Stack, TextField, Button, Typography, Snackbar } from '@mui/material';
import MainPage from "../../MainPage";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import '../../css/sign/Login.css';  // 로그인 스타일을 위한 CSS 파일 import

function Login() {
    const [member, setMember] = useState({
        memberId: '',
        password: ''
    });

    const { login: authLogin, isAuth } = useAuth();
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [failedAttempts, setFailedAttempts] = useState(0);  // 로그인 실패 횟수 상태
    const navigate = useNavigate();

    // 현재 URL 정보 가져오기.
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // 'type' 파라미터 가져오기.
    const loginType = queryParams.get('type');

    const handleChange = (event) => {
        setMember({ ...member, [event.target.name]: event.target.value });
    };

    const handleSignup = () => {
        navigate("/signup")
    };

    const login = (token) => {
        localStorage.setItem('jwt', token); // 토큰 저장
        localStorage.setItem('isAuth', 'true'); // 인증 상태 저장
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member)
        })
        .then(async res => {
            const data = await res.json();

            if (!res.ok) {
                // 로그인 실패 시, 서버에서 전달한 실패 횟수 반영
                if (data.failed_attempts !== undefined) {
                    setFailedAttempts(data.failed_attempts);  // 서버에서 받은 실패 횟수 반영
                }

                // 실패 횟수가 5에 도달하면 계정 잠금 처리
                if (data.failed_attempts >= 5) {
                    throw new Error(data.error);
                }

                throw new Error(data.error || "로그인 실패");
            }

            if (data.success && data.token) {
                const jwtToken = `Bearer ${data.token}`;
                sessionStorage.setItem("jwt", jwtToken);
                authLogin(jwtToken);

                return fetch(SERVER_URL + 'members', {
                    method: 'GET',
                    headers: { 'Authorization': jwtToken }
                });
            } else {
                throw new Error("로그인 실패: 계정 정보를 확인해 주세요.");
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("사용자 정보를 불러오는 데 실패했습니다.");
            }
            return res.json();
        })
        .then(() => {
            navigate("/main");
        })
        .catch(err => {
            console.error(err);
            setErrorMessage(err.message);
            setOpen(true);
        });
    };

    // 로그인 성공 후 메인 페이지로 이동
    if (isAuth) {
        return <MainPage />;
    } else {
        return (
            <div className="login-form"> {/* 폼을 감싸는 div에 클래스 추가 */}
                <Typography variant="h5" align="center" gutterBottom>
                    {loginType === 'member' && '일반회원 로그인'}
                    {loginType === 'linkage' && '연계회원 로그인'}
                    {loginType === 'admin' && '관리자 로그인'}
                </Typography>

                <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                    <Stack spacing={2} alignItems='center' mt={2}>
                        <TextField
                            name="memberId"
                            label="아이디"
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            type="password"
                            name="password"
                            label="비밀번호"
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <Button
                            className="inLogjs-log-btn"
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                        >
                            로그인
                        </Button>
                        <Button
                            className="inLogjs-signup-btn"
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            onClick={handleSignup}
                        >
                            회원가입
                        </Button>
                    </Stack>
                </form>

                {/* 로그인 실패 횟수 표시 */}
                {failedAttempts >= 5 && (
                    <Typography color="error" align="center" mt={2}>
                        5회 이상 로그인 실패로 계정이 잠겼습니다.
                        <br />관리자에게 문의해 주세요.
                    </Typography>
                )}

                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message={errorMessage}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                />
            </div>
        );
    }
}

export default Login;
