import React, { useState } from "react";
import { SERVER_URL } from "../../Constants";
import { Stack, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../../css/sign/Signup.css'; // Signup 스타일을 위한 CSS 파일 import

const Signup = () => {
    const [member, setMember] = useState({
        memberName: '',
        memberId: '',
        email: '',
        password: '',
        confirmPassword: '', // 비밀번호 확인 추가
        phone: '',
    });

    // 아이디 중복 검사 상태 추가.
    const [idCheckResult, setIdCheckResult] = useState({
        isAvailable: null, // true, false, null.
        message: '' // 상태에 따른 메세지 출력.
    });

    // 이메일 중복 검사 상태 추가.
    const [emailCheckResult, setEmailCheckResult] = useState({
        isAvailable: null,
        message: ''
    });

    // 비밀번호 확인 상태 추가.
    const [passwordCheck, setPasswordCheck] = useState('');

    // 가입 실패 상태 추가.
    const [signupCheck, setSignupCheck] = useState('');

    // 각 필드 길이수 상태 추가.
    const [fieldLength, setFieldLength] = useState({
        memberName: 0,
        memberId: 0,
        password: 0,
        confirmPassword: 0,
        phone: 0,
    });

    // 각 필드의 오류 메시지를 저장할 상태 추가
    const [errors, setErrors] = useState({
        memberName: '',
        memberId: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    
    const [loading, setLoading] = useState('');

    const navigator = useNavigate();

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        // 회원명 유효성 검사 --------------------------------------------------------------
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

        // 회원 아이디 유효성 검사 ---------------------------------------------------------
        if (!member.memberId) {
            tempErrors.memberId = "회원 아이디는 필수입니다."
            isValid = false;
        } else if (/\s/.test(member.memberId)) { // 공백 검사
            tempErrors.memberId = "회원 아이디에 공백을 포함할 수 없습니다.";
            isValid = false;
        }

        // 비밀번호 유효성 검사 -----------------------------------------------------------
        if (!member.password) {
            tempErrors.password = "비밀번호는 필수입니다.";
            isValid = false;
        } else if (member.password.length < 8 || member.password.length >= 20) {
            tempErrors.password = "비밀번호는 8자 이상, 20자 이하여야 합니다.";
            isValid = false;
        }

        // 비밀번호 확인 유효성 검사 -------------------------------------------------------
        if (member.password !== member.confirmPassword) {
            tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
            isValid = false;
        }

        // 이메일 유효성 검사 -------------------------------------------------------------
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hangulPattern = /[\u3131-\u3163\uac00-\ud7a3]/;  // 한글, 자음, 모음 검출하는 정규 표현식
        if (!member.email) {
            tempErrors.email = "이메일은 필수입니다.";
            isValid = false;
        } else if (hangulPattern.test(member.email)) {
            tempErrors.email = "이메일에는 한글을 사용할 수 없습니다.";
            isValid = false;
        } else if (!emailPattern.test(member.email)) {
            tempErrors.email = "유효한 이메일 형식이 아닙니다.";
            isValid = false;
        }

        // 전화번호 유효성 검사 -------------------------------------------------------------
        const phonePattern = /^[0-9]+$/;
        if (!member.phone) {
            tempErrors.phone = "전화번호는 필수입니다."
            isValid = false;
        } else if (!phonePattern.test(member.phone)) {
            tempErrors.phone = "유효한 전화번호 형식이 아닙니다. 숫자만 입력해 주세요."
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // 회원가입 함수.
    const signup = () => {
        setPasswordCheck(''); // 비번확인 초기화.
        setSignupCheck(''); // 가입확인 초기화.
        setLoading(true);

        // 가입 확인 전, 중복 검사 결과 확인
        if (!idCheckResult.isAvailable) {
            setSignupCheck("아이디 중복 검사를 완료해야 합니다.");
            setLoading(false); // 로딩 종료
            return;
        }

        // 가입 확인 전, 이메일 토큰 확인
        if (!emailCheckResult.isAvailable) {
            setSignupCheck("이메일 인증을 완료해야 합니다.");
            setLoading(false); // 로딩 종료
            return;
        }

        // 유효성 검사
        if (!validate()) {
            setLoading(false); // 로딩 종료
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
                    throw new Error(data.messages ? data.messages.join(", ") : "회원정보 등록 실패");
                });
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                alert("회원정보 등록이 완료되었습니다.\n이메일 인증 페이지로 이동합니다.");
                navigator("/emailVerification", { state: { member }});
            } else {
                setSignupCheck(data.message || "회원정보 등록 실패.");
            }
        })
        .catch(err => {
            console.error(err);
            setSignupCheck(err.message);
            setLoading(false); // 로딩 종료
        });
    }

    // 중복 검사 초기화 함수 Start -----------------------------------------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setMember({
            ...member,
            [name]: value
        });

        setFieldLength({
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
    // 중복 검사 초기화 함수 End -------------------------------------------------------

    // 아이디 숫자와 영어 대,소문자만 허용하는 함수 Start --------------------------------
    const handleInputMemberIdChange = (e) => {
        const { name, value } = e.target;

        // 숫자와 영어만 허용하는 정규 표현식
        const englishPattern = /^[A-Za-z0-9]*$/;

        // 숫자와 영어만 입력되도록 처리
        if (name === 'memberId') {
            if (!englishPattern.test(value)) {
                setErrors({
                    ...errors,
                    memberId: "아이디는 숫자와 영어 대소문자만 입력 가능합니다."
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
    // 아이디 숫자와 영어 대,소문자만 허용하는 함수 End --------------------------------

    // 아이디 중복 체크 함수 Start ---------------------------------------------------
    const checkDuplicateId = () => {
        // 공백 검사
        if (!member.memberId || /\s/.test(member.memberId)) { 
            setIdCheckResult({
                isAvailable: false,
                message: "회원 아이디로 공백은 입력이 불가능합니다."
            });
            return; // 공백이 포함된 경우 함수 종료
        }

        // 글자 수 검사
        if (member.memberId.length < 3 || member.memberId.length > 20) {
            setIdCheckResult({
                isAvailable: false,
                message: "회원 아이디는 3자 이상, 20자 이하로 설정해 주세요."
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
    // 아이디 중복 체크 함수 End -----------------------------------------------------

    // 이메일 중복 체크 함수 Start ---------------------------------------------------
    const checkDuplicateEmail = () => {
        // 공백 검사
        if (!member.email || /\s/.test(member.email)) {
            setEmailCheckResult({
                isAvailable: false,
                message: "이메일로 공백은 입력이 불가능합니다."
            });
            return;
        }

        fetch(SERVER_URL + 'check-duplicate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: member.email })
        })
        .then(res => res.json())
        .then(data => {
            if (data.isAvailable) {
                setEmailCheckResult({
                    isAvailable: true,
                    message: "사용 가능한 이메일입니다."
                });
            } else {
                setEmailCheckResult({
                    isAvailable: false,
                    message: "이미 사용 중인 이메일입니다."
                });
            }
        })
        .catch(err => {
            alert("중복 검사 중 문제가 발생했습니다!");
        });
    };
    // 이메일 중복 체크 함수 End -----------------------------------------------------

    // 전화번호 숫자만 허용하는 함수 Start --------------------------------------------
    const handlePhoneInputChange = (e) => {
        const { name, value } = e.target;
    
        // 숫자만 허용하는 정규식
        const numericValue = value.replace(/[^0-9]/g, "");
    
        // 상태 업데이트
        setMember({
            ...member,
            [name]: numericValue,
        });
    
        // 숫자만 입력된 경우 오류 메시지 초기화
        if (numericValue === value) {
            setErrors({
                ...errors,
                phone: "",
            });
        } else {
            // 숫자가 아닌 값이 포함된 경우 오류 메시지 설정
            setErrors({
                ...errors,
                phone: "전화번호는 숫자만 입력이 가능합니다.",
            });
        }
    };
    // 전화번호 숫자만 허용하는 함수 End -----------------------------------------------

    const getHelperText = (name, minLength, maxLength) => {
        const length = member[name].length;
    
        const minMessage = minLength ? `최소 ${minLength}자` : '';  // 최소 글자 수 메시지
        const maxMessage = maxLength ? `최대 ${maxLength}자` : '';  // 최대 글자 수 메시지
    
        // 최소, 최대 메시지를 조건에 맞게 합침
        let helperText = `${length}`;
    
        if (minMessage && maxMessage) {
            // 최소와 최대 모두 있을 경우
            helperText += ` / ${minMessage}, ${maxMessage}`;
        } else if (minMessage) {
            // 최소만 있을 경우
            helperText += ` / ${minMessage}`;
        } else if (maxMessage) {
            // 최대만 있을 경우
            helperText += ` / ${maxMessage}`;
        }
    
        return helperText;
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
                        inputProps={{minLength:2, maxLength:10}}
                        helperText={errors.memberName || getHelperText("memberName", 2)}
                    />
            
                    <TextField
                        label="회원 아이디"
                        name="memberId"
                        value={member.memberId}
                        onChange={handleInputMemberIdChange}
                        fullWidth
                        required
                        error={!!errors.memberId}
                        inputProps={{minLength:3, maxLength:20}}
                        helperText={errors.memberId || getHelperText("memberId",3, 20)}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                         // 중복 검사 버튼
                        onClick={checkDuplicateId}
                    >
                        아이디 중복 검사
                    </Button>
                    {idCheckResult.isAvailable !== null && (
                        <Typography
                            variant="body2"
                            color={idCheckResult.isAvailable ? "green" : "red"}
                        >
                            {idCheckResult.message}
                        </Typography>
                    )}
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
                    <Button
                        variant="outlined"
                        color="primary"
                         // 중복 검사 버튼
                        onClick={checkDuplicateEmail}
                    >
                        이메일 중복 검사
                    </Button>
                    {emailCheckResult.isAvailable !== null && (
                        <Typography
                            variant="body2"
                            color={emailCheckResult.isAvailable ? "green" : "red"}
                        >
                            {emailCheckResult.message}
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
                        inputProps={{minLength:8, maxLength:20}}
                        helperText={errors.password || getHelperText("password", 8, 20)}
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
                        helperText={errors.confirmPassword || getHelperText("confirmPassword")}
                    />
                    <TextField
                        label="전화번호"
                        name="phone"
                        value={member.phone}
                        onChange={handlePhoneInputChange}
                        fullWidth
                        required
                        error={!!errors.phone}
                        helperText={errors.phone}
                        inputProps={{minLength: 10, maxLength: 11}}
                    />
                    <Button
                        className="inSignjs-signup-btn"
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                    >
                        이메일 인증하기
                    </Button>
                    {/* 로딩 표시 */}
                    {loading && (
                        <CircularProgress />
                    )}
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
