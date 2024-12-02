import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
//유효성 검사 라이브러리 추가
import { Formik } from 'formik';
import * as Yup from 'yup';

function MealExpertWrite(props) {
    const [open, setOpen] = useState(false);
    const [expert, setExpert] = useState({
        exp_id: '',
        exp_name: '',
        exp_department: '',
        exp_position: '',
        exp_email: '',
        histories: [],
        qualifications: []
    });

    const validationSchema = Yup.object({
        exp_name: Yup.string().required('이름은 필수 입력값입니다.'),
        exp_department: Yup.string().required('소속은 필수 입력 값입니다.'),
        exp_position: Yup.string().required('직급은 필수 입력 값입니다.'),
        exp_email: Yup.string().email('유효하지 않은 이메일 형식입니다.').required('이메일은 필수 입력 값입니다.')
    });

    //모달 폼 열기
    const handleClickOpen = () => {
        setOpen(true);
    };

    //모달 폼 닫기
    const handleClose = () => {
        setOpen(false);
    };
    // 전문인력을 저장하고 모달 폼 닫기
    const handleSave = (values, validationForm) => {
        //유효성 검사를 실행하고, 에러가 있으면 화면에 표시
        validationForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                //유효성 검사를 통과한 경우에만 저장
                console.log("전송할 데이터", values);
                props.addExpert(values); //부모 컴포넌트로  expert 데이터 전달
                handleClose();
            } else {
                console.log("유효성 검사 실패:", errors); // 에러 로그 추가
                alert("유효하지 않은 입력값이 있습니다. 확인해 주세요.")
            }
        })
    };

    // //입력 필드 변경
    // const handleChange = (event) => {
    //     setExpert({ ...expert, [event.target.name]: event.target.value });
    // }


    // 보유자격을 여러 개 입력할 시 입력창을 추가
    const handleAddQualification = (setFieldValue, values) => {
        setFieldValue("qualifications", [...values.qualifications, ""]);
    };

    // 보유자격 추가입력 삭제
    const handleRemoveQualification = (setFieldValue, values, index) => {
        const newQualifications = [...values.qualifications];
        newQualifications.splice(index, 1);
        setFieldValue("qualifications", newQualifications);
    };

    // 경력사항을 여러 개 입력할 시 입력창을 추가
    const handleAddHistory = (setFieldValue, values) => {
        setFieldValue("histories", [...values.histories, ""]);
    };

    // 경력사항 추가입력 삭제
    const handleRemoveHistory = (setFieldValue, values, index) => {
        const newHistories = [...values.histories];
        newHistories.splice(index, 1);
        setFieldValue("histories", newHistories);
    };

    return (
        <div>
            <Button variant="contained"
                onClick={handleClickOpen}>정보 추가하기</Button>
            <Dialog
                open={open}
                onClose={handleClose}>
                <DialogTitle>새 전문인력 정보</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={expert} //expert 상태를 Formik의 초기값으로 전달
                        validationSchema={validationSchema}
                        enableReinitialize  //expert 상태가 변경될 때마다 Formik 값도 리렌더링
                    >
                        {({ values, errors, handleChange, handleBlur, setFieldValue, validateForm }) => (
                            <form>
                                <Stack spacing={4} sx={{ mt: 1 }}>
                                    <TextField
                                        label="이름"
                                        name="exp_name"
                                        variant="standard"
                                        value={values.exp_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={errors.exp_name}
                                        error={Boolean(errors.exp_name)}
                                    />
                                    <TextField
                                        label="소속"
                                        name="exp_department"
                                        variant="standard"
                                        value={values.exp_department}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={errors.exp_department}
                                        error={Boolean(errors.exp_department)}
                                    />
                                    <TextField
                                        label="직급"
                                        name="exp_position"
                                        variant="standard"
                                        value={values.exp_position}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={errors.exp_position}
                                        error={Boolean(errors.exp_position)}
                                    />
                                    <TextField
                                        label="이메일"
                                        name="exp_email"
                                        variant="standard"
                                        value={values.exp_email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={errors.exp_email}
                                        error={Boolean(errors.exp_email)}
                                    />
                                    {/* 보유자격 및 경력사항(복수입력) */}
                                    {/* 보유자격 */}
                                    <div>
                                        {values.qualifications.map((qualification, index) => (
                                            <div key={index}>
                                                <TextField
                                                    label="보유자격"
                                                    name={`qualifications[${index}]`}
                                                    value={qualification}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Button variant="contained" onClick={() => handleRemoveQualification(setFieldValue, values, index)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="contained" onClick={() => handleAddQualification(setFieldValue, values)}>자격 추가</Button>
                                    </div>

                                    {/* 경력사항 */}
                                    <div>
                                        {values.histories.map((history, index) => (
                                            <div key={index}>
                                                <TextField
                                                    label="경력사항"
                                                    name={`histories[${index}]`}
                                                    value={history}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Button variant="contained" onClick={() => handleRemoveHistory(setFieldValue, values, index)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="contained" onClick={() => handleAddHistory(setFieldValue, values)}>경력 추가</Button>
                                    </div>
                                    <DialogActions>
                                        <Button onClick={handleClose}>닫기</Button>
                                        <Button onClick={() => handleSave(values, validateForm)}>저장</Button>
                                    </DialogActions>
                                </Stack>
                            </form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default MealExpertWrite;