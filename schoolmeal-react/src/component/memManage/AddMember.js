import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from '@mui/material/Button';
import { Typography, Box, TextField } from "@mui/material";

function AddMember(props) {
    const [open, setOpen] = useState(false);
    const [member, setMember] = useState({
        memberName: '변경요망',
        memberId: '',
        role: 'GUEST', // 기본값 GUEST로 설정
        email: 'test@test.com',
        phone: '01011112222',
        locked: 'false',
    });

    // 모달 폼 열기
    const handleClickOpen = () => {
        if (window.confirm("<<경고>>\n정말 급한 경우에만 사용하세요! \n비밀번호는 1234로 생성됩니다.")) {
            setOpen(true);
        }
    };

    // 모달 폼 닫기
    const handleClose = () => {
        setOpen(false);
    };

    // 변경 감지 이벤트 핸들러
    const handleChange = (event) => {
        setMember({...member, [event.target.name]: event.target.value});
    }

    // 저장 함수
    const handleSave = () => {
        // 스프링 부트의 password값이 nullable=false이므로, 고정값 생성
        const newMember = {
            ...member,
            password: '$2a$12$M8D4Sb86gkdFd8K1jHKXTeCDQMVR3qGPcY4F4AI0qOztz0Z9Bwi.2' // "1234"
        }
        props.addMember(newMember);
        setMember({ memberId: '', role: 'GUEST'}); // 기본값 'GUEST'로 초기화
        handleClose();
    }

    return(
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: 2,
                    '&:hover': { boxShadow: 4 }
                }}>
                긴급 추가
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>새 회원 추가</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    정말 급한 경우에만 사용하세요!
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    비밀번호는 1234로 생성됩니다.
                </Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="회원 아이디"
                            name="memberId"
                            value={member.memberId}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            sx={{ boxShadow: 1 }}
                            margin="normal"
                            required
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-label">권한을 선택하세요...</InputLabel>
                            <Select
                                labelId="role-label"
                                name="role"
                                value={member.role || 'GUEST'} // 기본값 'GUEST' 적용
                                onChange={handleChange}
                                label="권한을 선택하세요..."
                                sx={{
                                    backgroundColor: 'background.paper',
                                    borderRadius: '4px',
                                    boxShadow: 1,
                                    '& .MuiSelect-icon': { color: 'primary.main' }
                                }}
                            >
                                <MenuItem value="LINKAGE">LINKAGE</MenuItem>
                                <MenuItem value="MEMBER">MEMBER</MenuItem>
                                <MenuItem value="GUEST">GUEST</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        color="primary"
                        sx={{ fontWeight: 'bold', padding: '6px 20px', borderRadius: '8px' }}>
                        저장
                    </Button>
                    <Button 
                        onClick={handleClose} 
                        variant="outlined" 
                        color="secondary"
                        sx={{ fontWeight: 'bold', padding: '6px 20px', borderRadius: '8px' }}>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddMember;
