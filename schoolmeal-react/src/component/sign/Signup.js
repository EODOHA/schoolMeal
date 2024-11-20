import React, { useState } from "react";
import { SERVER_URL } from "../../Constants";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../../css/sign/Signup.css'; // Signup 스타일을 위한 CSS 파일 import

const Signup = () => {
    const [member, setMember] = useState({
        memberName: '',
        memberId: '',
        password: '',
        confirmPassword: '', // 비밀번호 확인 추가
        email: '',
        phone: ''
    });

    // 중복 검사 상태 추가.
    const [idCheckResult, setIdCheckResult] = useState({
        isAvailable: null, // true, false, null.
        message: '' // 상태에 따른 메세지 출력.
    });

    // 비밀번호 확인 상태 추가.
    const [passwordCheck, setPasswordCheck] = useState('');

    // 가입 실패 상태 추가
    const [signupCheck, setSignupCheck] = useState('');

    // 각 필드의 오류 메시지를 저장할 상태 추가
    const [errors, setErrors] = useState({
        memberName: '',
        memberId: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
    });

    const navigator = useNavigate();

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        // 회원명 유효성 검사
        const hangulConsonants = /[ㄱ-ㅎ]/; // 한글 자음을 검출하는 정규 표현식
        const hangulVowels = /[ㅏ-ㅣ]/; // 한글 모음을 검출하는 정규 표현식
        const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/; // 특수문자를 검출하는 정규 표현식
        
        if (!member.memberName) {
            tempErrors.memberName = "회원명은 필수입니다.";
            isValid = false;
        } else if (hangulConsonants.test(member.memberName) && !hangulVowels.test(member.memberName)) {
            tempErrors.memberName = "회원명에 자음만 사용할 수 없습니다.";
            isValid = false;
        } else if (hangulVowels.test(member.memberName) && !hangulConsonants.test(member.memberName)) {
            tempErrors.memberName = "회원명에 모음만 사용할 수 없습니다.";
            isValid = false;
        } else if (specialCharacters.test(member.memberName)) {
            tempErrors.memberName = "회원명에 특수문자를 사용할 수 없습니다.";
            isValid = false;
        }

        // 비밀번호 유효성 검사
        if (!member.password) {
            tempErrors.password = "비밀번호는 필수입니다.";
            isValid = false;
        } else if (member.password.length < 8 || member.password.length >= 20) {
            tempErrors.password = "비밀번호는 8자 이상, 20자 이하여야 합니다.";
            isValid = false;
        }

        // 비밀번호 확인 유효성 검사
        if (member.password !== member.confirmPassword) {
            tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
            isValid = false;
        }

        // 이메일 유효성 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!member.email) {
            tempErrors.email = "이메일은 필수입니다.";
            isValid = false;
        } else if (!emailPattern.test(member.email)) {
            tempErrors.email = "유효한 이메일 형식이 아닙니다.";
            isValid = false;
        }

        // 전화번호 유효성 검사 (예: 010-1234-5678, 012-345-6789 형식)
        const phonePattern = /^\d{3}-\d{3,4}-\d{4}$/;
        if (!member.phone) {
            tempErrors.phone = "전화번호는 필수입니다.";
            isValid = false;
        } else if (!phonePattern.test(member.phone)) {
            tempErrors.phone = "유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const signup = () => {
        setPasswordCheck(''); // 비번확인 초기화.
        setSignupCheck(''); // 가입확인 초기화.

        // 가입확인 전, 중복 검사 결과 확인
        if (!idCheckResult.isAvailable) {
            setSignupCheck("아이디 중복 검사를 완료해야 합니다.");
            return;
        }

        // 유효성 검사
        if (!validate()) {
            return; // 유효성 검사가 실패하면 종료
        }

        fetch(SERVER_URL + 'signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => {
                    throw new Error(data.messages ? data.messages.join(", ") : "회원가입 실패");
                });
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                alert("가입이 완료되었습니다.\n로그인 후 이용해 주세요.");
                navigator("/main");
            } else {
                setSignupCheck(data.message || "회원가입 실패.");
            }
        })
        .catch(err => {
            console.error(err);
            setSignupCheck(err.message);
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMember({
            ...member,
            [name]: value
        });

        // 회원 아이디가 변경될 때 중복 확인 상태 초기화
        if (name === 'memberId') { 
            setIdCheckResult({
                isAvailable: null,
                message: ""
            });
        }

        // 오류 메시지 초기화
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const handleInputMemberIdChange = (e) => {
        const { name, value } = e.target;

        // 영어만 허용하는 정규 표현식
        const englishPattern = /^[A-Za-z]*$/;

        // 영어만 입력되도록 처리
        if (name === 'memberId') {
            if (!englishPattern.test(value)) {
                setErrors({
                    ...errors,
                    memberId: "영어 대소문자만 입력 가능합니다."
                });
                return; // 영어가 아닌 문자가 포함되면 입력 무시
            }
        }

        setMember({
            ...member,
            [name]: value
        });

        // 회원 아이디가 변경될 때 중복 확인 상태 초기화
        if (name === 'memberId') { 
            setIdCheckResult({
                isAvailable: null,
                message: ""
            });
        }

        // 오류 메시지 초기화
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const checkDuplicateId = () => {
        // 아이디 유효성 검사 (영어 대소문자만 허용)
        const idPattern = /^[A-Za-z]+$/; // 영어 대소문자만 허용하는 정규 표현식
        if (!member.memberId.trim()) {
            setIdCheckResult({
                isAvailable: false,
                message: "회원 아이디를 입력해 주세요."
            });
            return;
        } else if (!idPattern.test(member.memberId)) {
            setIdCheckResult({
                isAvailable: false,
                message: "아이디는 영어 대소문자만 사용해야 합니다."
            });
            return;
        }

        fetch(SERVER_URL + 'check-duplicate-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: member.memberId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.isAvailable) {
                setIdCheckResult({
                    isAvailable: true,
                    message: "사용 가능한 아이디입니다."
                });
            } else {
                setIdCheckResult({
                    isAvailable: false,
                    message: "이미 사용 중인 아이디입니다."
                });
            }
        })
        .catch(err => {
            alert("중복 검사 중 문제가 발생했습니다!");
        });
    };

    return (
        <div className="signup-form">
            <Typography variant="h5" align="center" gutterBottom>
                회원가입
            </Typography>

            <form onSubmit={(e) => { e.preventDefault(); signup(); }}>
                <Stack spacing={2} alignItems='center' mt={2}>
                    <TextField
                        label="회원명"
                        name="memberName"
                        value={member.memberName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.memberName}
                        helperText={errors.memberName}
                    />
                    <TextField
                        label="회원 아이디"
                        name="memberId"
                        value={member.memberId}
                        onChange={handleInputMemberIdChange}
                        fullWidth
                        required
                        error={!!errors.memberId}
                        helperText={errors.memberId}
                        inputMode="latin" // 영어 키보드 모드
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={checkDuplicateId} // 중복 검사 버튼
                    >
                        중복 검사
                    </Button>
                    {idCheckResult.isAvailable !== null && ( // 상태에 따라 메시지 표시
                        <Typography variant="body2" color={idCheckResult.isAvailable ? "green" : "red"}>
                            {idCheckResult.message}
                        </Typography>
                    )}
                    <TextField
                        label="비밀번호"
                        name="password"
                        type="password"
                        value={member.password}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        label="비밀번호 확인" // 비밀번호 확인 필드 추가
                        name="confirmPassword"
                        type="password"
                        value={member.confirmPassword}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <TextField
                        label="이메일"
                        name="email"
                        value={member.email}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="전화번호"
                        name="phone"
                        value={member.phone}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    <Button
                        className="inSignjs-signup-btn"
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                    >
                        가입하기
                    </Button>
                    {signupCheck && ( // 가입 관련 오류 표시
                        <Typography variant="body2" color="red">
                            {signupCheck}
                        </Typography>
                    )}
                </Stack>
            </form>
        </div>
    );
}

export default Signup;
