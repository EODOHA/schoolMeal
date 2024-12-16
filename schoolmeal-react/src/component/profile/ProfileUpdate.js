import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../../Constants";
import { Stack, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../../css/sign/Signup.css'; // Signup 스타일을 위한 CSS 파일 import

const ProfileUpdate = () => {
    const [member, setMember] = useState({
        memberName: '',
        memberId: '',
        password: '',
        confirmPassword: '', // 비밀번호 확인 추가
        email: '',
        phone: ''
    });

    // 비밀번호 확인 상태 추가.
    const [passwordCheck, setPasswordCheck] = useState('');

    // 업데이트 확인 상태 추가.
    const [updateCheck, setUpdateCheck] = useState('');

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
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
    });

    const navigator = useNavigate();

    const token = sessionStorage.getItem('jwt');

    const createHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': token
    });

    // 로그인된 멤버 정보 불러오기.
    useEffect(() => {
        fetch(SERVER_URL + "members/me", {
            method: "GET",
            headers: createHeaders(),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch member information.");
            }
            return res.json();
        })
        .then((data) => {
            setMember({
                memberName: data.memberName || '',
                memberId: data.memberId || '',
                password: '', // 비밀번호는 빈 값으로 유지.
                confirmPassword: '', // 비밀번호 확인도 빈 값으로 유지.
                email: data.email || '',
                phone: data.phone || '',
            });
        })
        .catch((err) => {
            console.error(err.message);
            setUpdateCheck("회원 정보를 불러오는 데 실패했습니다.");
        })
    }, []); // 의존성 배열을 비워, 한 번만 실행.

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

    // 회원정보 수정 ---------------------------------------------------------------------
    const updateProfile = () => {
        if (!validate()) {
            return;
        }

        fetch(SERVER_URL + "members/me", {
            method: "PUT",
            headers: createHeaders(),
            body: JSON.stringify(member)
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to update profile.");
            }
            return res.json();
        })
        .then(() => {
            setUpdateCheck("회원정보가 성공적으로 수정되었습니다.");
            alert("수정이 완료되었습니다.");
        })
        .catch((err) => {
            console.error(err.message);
            setUpdateCheck("회원정보 수정에 실패했습니다.");
        });
    };


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
                    memberId: "혼합된 숫자와 영어 대소문자만 입력 가능합니다."
                });
                return; // 영어가 아닌 문자가 포함되면 입력 무시
            }
        }

        setMember({
            ...member,
            [name]: value
        });

        // 오류 메시지 초기화
        setErrors({
            ...errors,
            [name]: ''
        });
    };

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
    
        // 오류 메시지 초기화
        setErrors({
            ...errors,
            phone: "전화번호는 숫자만 입력이 가능합니다.",
        });
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

    // 회원탈퇴 -----------------------------------------------------------------------
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const deleteAccount = () => {
        fetch(SERVER_URL + "members/me", {
            method: "DELETE",
            headers: createHeaders(),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("회원탈퇴 실패!");
            }
            sessionStorage.removeItem('jwt');
            navigator("/main");
            window.location.reload();  // 페이지 새로고침
        })
        .catch((err) => {
            console.error(err.message);
            setUpdateCheck("회원탈퇴에 실패했습니다.");
        });
    };

    // 회원탈퇴 확인 다이얼로그 열기.
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <div className="signup-form">
            <Typography variant="h5" align="center" gutterBottom>
                회원정보수정
            </Typography>

            <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }}>
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
                        disabled={true} // 비활성화 상태로 설정
                    />
                    <TextField
                        label="비밀번호(미변경 시, 기존 비밀번호 입력)"
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
                        label="이메일"
                        name="email"
                        value={member.email}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={true} // 비활성화 상태로 설정
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
                        수정하기
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenDeleteDialog}
                        fullWidth
                    >
                        회원탈퇴
                    </Button>

                    {updateCheck && ( // 가입 관련 오류 표시
                        <Typography variant="body2" color="red">
                            {updateCheck}
                        </Typography>
                    )}
                </Stack>
            </form>

            {/* 회원탈퇴 다이얼로그 */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>회원탈퇴</DialogTitle>
                <DialogContent>
                    <Typography>
                        정말로 회원탈퇴를 하시겠습니까?
                    </Typography>
                    <Typography>
                        이 작업은 되돌릴 수 없습니다!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        취소
                    </Button>
                    <Button onClick={deleteAccount} color="secondary">
                        탈퇴
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProfileUpdate;
