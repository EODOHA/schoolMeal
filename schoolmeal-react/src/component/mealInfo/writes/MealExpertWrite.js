import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { TextField, Button, Stack } from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SERVER_URL } from '../../../Constants';
import { useAuth } from '../../sign/AuthContext';

function MealExpertWrite({ addExpert }) {
    const [open, setOpen] = useState(false);
    const { token } = useAuth();

    // 초기값 정의
    const initialValues = {
        exp_name: '',
        exp_department: '',
        exp_position: '',
        exp_email: '',
        exp_author: '',
        qualifications: [[{ exp_qual_description: '' }]],
        histories: [{ exp_hist_description: '' }],
    };


    const validationSchema = Yup.object({
        exp_name: Yup.string().required('이름은 필수 입력값입니다.'),
        exp_department: Yup.string().required('소속은 필수 입력값입니다.'),
        exp_position: Yup.string().required('직급은 필수 입력값입니다.'),
        exp_email: Yup.string().email('유효하지 않은 이메일 형식입니다.').required('이메일은 필수 입력값입니다.'),
    })


    // 데이터 제출 처리
    const handleSave = async (values) => {
        const data = {
            exp_name: values.exp_name,
            exp_department: values.exp_department,
            exp_position: values.exp_position,
            exp_email: values.exp_email,
            qualifications: values.qualifications.map((qual) => ({
                exp_qual_description: qual.exp_qual_description,
            })),
            histories: values.histories.map((hist) => ({
                exp_hist_description: hist.exp_hist_description,
            })),
        };

        // console.log("요청 데이터: {}", data);
        try {
            // 서버로 POST 요청 (JSON 형식으로 보내기)
            await axios.post(`${SERVER_URL}mealExpert`, data, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            // console.log("Sending POST request to:", `${SERVER_URL}mealExpert`);

            alert('전문인력 정보가 저장되었습니다.');
            addExpert(data);  // 부모 컴포넌트로 데이터 전달
            // console.log(data);
            handleClose();  // 모달 닫기

        } catch (error) {
            console.error('전문가 추가 실패', error);
            alert('전문가 추가에 실패했습니다.');
        }
    };

    // 모달 폼 열기/닫기
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                정보 추가하기
            </Button>
            <Dialog open={open} onClose={handleClose}
                // 모달폼 너비 조절
                sx={{
                    '& .MuiDialog-paper': {
                        width: '50%', // 너비를 설정
                        maxWidth: '800px', // 최대 너비 설정 
                    },
                }}>
                <DialogTitle>새 전문인력 정보</DialogTitle>
                <DialogContent>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSave}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={4} sx={{ mt: 1 }}>
                                    <TextField
                                        label="이름"
                                        name="exp_name"
                                        variant="standard"
                                        value={values.exp_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={touched.exp_name && errors.exp_name}
                                        error={Boolean(touched.exp_name && errors.exp_name)}
                                    />
                                    <TextField
                                        label="소속"
                                        name="exp_department"
                                        variant="standard"
                                        value={values.exp_department}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={touched.exp_department && errors.exp_department}
                                        error={Boolean(touched.exp_department && errors.exp_department)}
                                    />
                                    <TextField
                                        label="직급"
                                        name="exp_position"
                                        variant="standard"
                                        value={values.exp_position}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={touched.exp_position && errors.exp_position}
                                        error={Boolean(touched.exp_position && errors.exp_position)}
                                    />
                                    <TextField
                                        label="이메일"
                                        name="exp_email"
                                        variant="standard"
                                        value={values.exp_email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={touched.exp_email && errors.exp_email}
                                        error={Boolean(touched.exp_email && errors.exp_email)}
                                    />

                                    {/* 보유자격 */}
                                    <FieldArray name="qualifications">
                                        {({ remove, push }) => (
                                            <div>
                                                {values.qualifications.map((q, index) => (
                                                    <div key={index}>
                                                        <TextField
                                                            label="보유자격"
                                                            name={`qualifications[${index}].exp_qual_description`}
                                                            value={q.exp_qual_description}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            helperText={
                                                                touched.qualifications &&
                                                                touched.qualifications[index] &&
                                                                errors.qualifications &&
                                                                errors.qualifications[index]?.exp_qual_description
                                                            }
                                                            error={
                                                                touched.qualifications &&
                                                                touched.qualifications[index] &&
                                                                Boolean(errors.qualifications?.[index]?.exp_qual_description)
                                                            }
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => remove(index)}
                                                            disabled={values.qualifications.length === 1}
                                                        >
                                                            삭제
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button variant="contained" onClick={() => push({ exp_qual_description: '' })}>
                                                    자격 추가
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>

                                    {/* 경력사항 */}
                                    <FieldArray name="histories">
                                        {({ remove, push }) => (
                                            <div>
                                                {values.histories.map((h, index) => (
                                                    <div key={index}>
                                                        <TextField
                                                            label="경력사항"
                                                            name={`histories[${index}].exp_hist_description`}
                                                            value={h.exp_hist_description}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            helperText={
                                                                touched.histories &&
                                                                touched.histories[index] &&
                                                                errors.histories &&
                                                                errors.histories[index]?.exp_hist_description
                                                            }
                                                            error={
                                                                touched.histories &&
                                                                touched.histories[index] &&
                                                                Boolean(errors.histories?.[index]?.exp_hist_description)
                                                            }
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => remove(index)}
                                                            disabled={values.histories.length === 1}
                                                        >
                                                            삭제
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button variant="contained" onClick={() => push({ exp_hist_description: '' })}>
                                                    경력 추가
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                    <DialogActions>
                                        <Button onClick={handleClose}>닫기</Button>
                                        <Button type="submit">저장</Button>
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