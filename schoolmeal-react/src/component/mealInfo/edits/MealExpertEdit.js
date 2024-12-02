import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
//유효성 검사 라이브러리 추가
import { Formik } from 'formik';
import * as Yup from 'yup';

function MealExpertEdit(props) {
    // console.log("전달받은 데이터",props.data.exp_id);
    const [open, setOpen] = useState(false);
    const [expert, setExpert] = useState(props.data);

    // 모달 폼 열기
    const handleClickOpen = () => {
        setExpert({
            exp_id: props.data.exp_id,
            exp_name: props.data.exp_name,
            exp_department: props.data.exp_department,
            exp_position: props.data.exp_position,
            exp_email: props.data.exp_email,
            qualifications: props.data.qualifications,
            histories: props.data.histories
        })
        setOpen(true);

    };
    const validationSchema = Yup.object({
        exp_name: Yup.string().required('이름은 필수 입력값입니다.'),
        exp_department: Yup.string().required('소속은 필수 입력 값입니다.'),
        exp_position: Yup.string().required('직급은 필수 입력 값입니다.'),
        exp_email: Yup.string().email('유효하지 않은 이메일 형식입니다.').required('이메일은 필수 입력 값입니다.')
    });

    // 모달 폼 닫기
    const handleClose = () => {
        setOpen(false);
    };

    //입력 필드 변경
    // const handleChange = (event) => {
    //     setExpert({ ...expert, [event.target.name]: event.target.value });
    // }

    // 인력 정보를 수정하고 모달 폼을 닫음
    const handleSave = (values, validateForm, setErrors) => {
        //유효성 검사를 실행하고, 에러가 있으면 화면에 표시
        validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                //유효성 검사를 통과한 경우에만 수정
                console.log("수정한 데이터", values)
                props.updateExpert(values);
                handleClose();
            } else {
                alert("유효하지 않은 입력값이 있습니다. 확인해 주세요.")
            }
        })

    }

    // 보유자격을 여러 개 입력할 시 입력창을 추가
    const handleAddQualification = () => {
        setExpert((prevExpert) => ({
            ...prevExpert,
            qualifications: [...prevExpert.qualifications, '']  // 빈 문자열로 새로운 자격 추가
        }));
    }
    // 보유자격 추가입력 삭제
    const handleRemoveQualification = (index) => {
        const newQualifications = [...expert.qualifications];
        newQualifications.splice(index, 1);  // 해당인덱스 삭제
        setExpert((prevExpert) => ({
            ...prevExpert,
            qualifications: newQualifications
        }));
    };

    // 경력사항을 여러 개 입력할 시 입력창을 추가
    const handleAddHistory = () => {
        setExpert((prevExpert) => ({
            ...prevExpert,
            histories: [...prevExpert.histories, '']
        }));
    }
    // 경력사항 추가입력 삭제
    const handleRemoveHistory = (index) => {
        const newHistories = [...expert.histories];
        newHistories.splice(index, 1);
        setExpert((prevExpert) => ({
            ...prevExpert,
            histories: newHistories
        }));
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <EditIcon color="white" />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>급식전문 인력정보 수정</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={expert}
                        validationSchema={validationSchema}
                        enableReinitialize
                    >
                        {({ values, errors, /*touched,*/ handleChange, handleBlur, validateForm, setErrors }) => (
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
                                    <div>
                                        {expert.qualifications.map((qualification, index) => (
                                            <div key={index}>
                                                <TextField
                                                    label="보유자격"
                                                    name="qualifications"
                                                    value={qualification.exp_qual_description}
                                                    onChange={(e) => {
                                                        const newQualifications = [...expert.qualifications];
                                                        newQualifications[index] = e.target.value;
                                                        setExpert((prevExpert) => ({
                                                            ...prevExpert,
                                                            qualifications: newQualifications
                                                        }));
                                                    }}
                                                />
                                                <Button variant="contained" onClick={() => handleRemoveQualification(index)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="contained" onClick={handleAddQualification}>자격 추가</Button>
                                    </div>
                                    <div>
                                        {expert.histories.map((history, index) => (
                                            <div key={index}>
                                                <TextField
                                                    label="경력사항"
                                                    name="histories"
                                                    value={history.exp_hist_description}
                                                    onChange={(e) => {
                                                        const newHistories = [...expert.histories];
                                                        newHistories[index] = e.target.value;
                                                        setExpert((prevExpert) => ({
                                                            ...prevExpert,
                                                            histories: newHistories
                                                        }));
                                                    }}
                                                />
                                                <Button variant='contained' onClick={() => handleRemoveHistory(index)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant='contained' onClick={handleAddHistory}>경력 추가</Button>
                                    </div>
                                    <DialogActions>
                                        <Button onClick={handleClose}>취소</Button>
                                        <Button onClick={() => handleSave(values, validateForm, setErrors)}>저장</Button>
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


export default MealExpertEdit;