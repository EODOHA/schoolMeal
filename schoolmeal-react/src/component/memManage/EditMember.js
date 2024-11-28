import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import { Button, Typography, Box } from "@mui/material";

function EditMember(props) {
    const [open, setOpen] = useState(false);
    const [member, setMember] = useState({
        memberId: '',
        role: '',
        password: ''
    });

    // 모달 폼 열기
    const handleClickOpen = () => {
        // ADMIN 수정 막기
        if (props.data.row.role === 'ADMIN') {
            alert("[경고] ADMIN의 권한은 수정할 수 없습니다!");
            return;
        }
        setMember({
            memberId: props.data.row.memberId,
            role: props.data.row.role,
            password: ''
        });
        setOpen(true);
    };

    // 모달 폼 닫기
    const handleClose = () => {
        setOpen(false);
    };

    // 변경 감지 이벤트 핸들러
    const handleChange = (event) => {
        setMember({ ...member, [event.target.name]: event.target.value });
    };

    // 유저 수정하고 모달 폼 닫음
    const handleSave = () => {
        const updateMember = {
            ...member,
            // 입력 값 없을 시, 기존 값 그대로 유지.
            password: props.data.row.password
        };
        props.updateMember(updateMember, props.data.id);
        handleClose();
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen} sx={{ fontSize: '2rem', color: 'primary.main' }}>
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>권한 수정</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        유저의 권한을 선택하세요.
                    </Typography>
                    <FormControl fullWidth margin="normal" sx={{ boxShadow: 1 }}>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={member.role}
                            onChange={handleChange}
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
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        sx={{
                            fontWeight: 'bold',
                            padding: '6px 20px',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: 'primary.dark' }
                        }}>
                        수정
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="secondary"
                        sx={{
                            fontWeight: 'bold',
                            padding: '6px 20px',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: 'secondary.light' }
                        }}>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditMember;
