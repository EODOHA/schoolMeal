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
import { Formik } from 'formik';
import * as Yup from 'yup';

function MealExpertEdit(props) {
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
            exp_author: props.data.exp_author,
            qualifications: props.data.qualifications,
            histories: props.data.histories
        });
        setOpen(true);
    };

    // 유효성 검사 스키마
    const validationSchema = Yup.object({
        exp_name: Yup.string().required('이름은 필수 입력값입니다.'),
        exp_department: Yup.string().required('소속은 필수 입력값입니다.'),
        exp_position: Yup.string().required('직급은 필수 입력값입니다.'),
        exp_email: Yup.string().email('유효하지 않은 이메일 형식입니다.').required('이메일은 필수 입력값입니다.')
    });

    // 모달 폼 닫기
    const handleClose = () => {
        setOpen(false);
    };

    // 수정 후 저장
    const handleSave = (values, validateForm) => {
        validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                props.updateExpert(values); // 수정된 데이터 전달
                handleClose();
            } else {
                alert("유효하지 않은 입력값이 있습니다. 확인해 주세요.");
            }
        });
    };

    // 보유 자격 추가
    const handleAddQualification = () => {
        setExpert((prevExpert) => ({
            ...prevExpert,
            qualifications: [...prevExpert.qualifications, { exp_qual_description: '' }]
        }));
    };

    // 보유 자격 삭제
    const handleRemoveQualification = (index) => {
        const newQualifications = [...expert.qualifications];
        newQualifications.splice(index, 1);
        setExpert((prevExpert) => ({
            ...prevExpert,
            qualifications: newQualifications
        }));
    };

    // 경력사항 추가
    const handleAddHistory = () => {
        setExpert((prevExpert) => ({
            ...prevExpert,
            histories: [...prevExpert.histories, { exp_hist_description: '' }]
        }));
    };

    // 경력사항 삭제
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
            <Dialog open={open} onClose={handleClose}
                // 모달폼 너비 조절
                sx={{
                    '& .MuiDialog-paper': {
                        width: '50%', // 너비를 설정
                        maxWidth: '800px', // 최대 너비 설정 
                    },
                }}>
                <DialogTitle>급식전문 인력정보 수정</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={expert}
                        validationSchema={validationSchema}
                        enableReinitialize
                    >
                        {({ values, errors, handleChange, handleBlur, validateForm }) => (
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
                                                    name={`qualifications[${index}].exp_qual_description`}
                                                    value={qualification.exp_qual_description}
                                                    onChange={(e) => {
                                                        const newQualifications = [...expert.qualifications];
                                                        newQualifications[index].exp_qual_description = e.target.value;
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
                                                    name={`histories[${index}].exp_hist_description`}
                                                    value={history.exp_hist_description}
                                                    onChange={(e) => {
                                                        const newHistories = [...expert.histories];
                                                        newHistories[index].exp_hist_description = e.target.value;
                                                        setExpert((prevExpert) => ({
                                                            ...prevExpert,
                                                            histories: newHistories
                                                        }));
                                                    }}
                                                />
                                                <Button variant="contained" onClick={() => handleRemoveHistory(index)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="contained" onClick={handleAddHistory}>경력 추가</Button>
                                    </div>
                                    <DialogActions>
                                        <Button onClick={handleClose}>취소</Button>
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

export default MealExpertEdit;