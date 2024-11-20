import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';

function BanMember(props) {
    const [open, setOpen] = useState(false);
    const [member, setMember] = useState({
        memberId: '',
        role: '',
        password: ''
    });
    const [banDuration, setBanDuration] = useState('1d'); // 차단 기간 상태

    // 모달 폼 열기
    const handleClickOpen = () => {
        // ADMIN 차단 방지
        if (props.data.row.role === 'ADMIN') {
            alert("[경고] ADMIN은 차단할 수 없습니다!");
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

    // 차단 기간 변경 이벤트 핸들러
    const handleBanDurationChange = (event) => {
        setBanDuration(event.target.value);
    };

    // 차단 수정하고 모달 폼 닫음
    const handleSave = () => {
        const banUpdateMember = {
            ...member,
            // 입력 값 없을 시, 기존 값 그대로 유지.
            password: props.data.row.password,
            // 차단 기간 디폴트 참이면 널, 아니면 설정 기간대로.
            banUntil: banDuration === 'default' ? null : calculatedBanUntil(banDuration)
        };
        props.banUpdateMember(banUpdateMember, props.data.id);
        handleClose();
    };

    // 차단 기간에 따른 해제일 계산
    const calculatedBanUntil = (duration) => {
        const now = new Date();
        let banEndDate;

        switch (duration) {
            case '10sec':
                banEndDate = new Date(now.getTime() + 10 * 1000);
                break;
            case '1d':
                banEndDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            case '7d':
                banEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case '1m':
                banEndDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                break;
            case 'permanent':
                banEndDate = new Date(9999, 11, 31); // 영구 차단
                break;
            default:
                banEndDate = null;
                break;
        }

        return banEndDate ? new Date(banEndDate.getTime() - banEndDate.getTimezoneOffset() * 60000).toISOString() : null;
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <DoNotTouchIcon color="error"></DoNotTouchIcon>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>회원 차단 설정</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        회원을 차단할 기간을 선택하세요.
                    </DialogContentText>
                    <br />
                    <Typography variant="body2" color="textSecondary">
                        차단된 회원은 차단 해제 전까지 로그인이 불가능하며,
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        잠금도 함께 해제됩니다.
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        <Select
                            value={banDuration}
                            onChange={handleBanDurationChange}
                            displayEmpty
                        >
                            <MenuItem value="10sec">10초</MenuItem>
                            <MenuItem value="1d">1일</MenuItem>
                            <MenuItem value="7d">7일</MenuItem>
                            <MenuItem value="1m">1개월</MenuItem>
                            <MenuItem value="permanent">영구 차단</MenuItem>
                            <MenuItem value="defalut">차단 해제</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">설정</Button>
                    <Button onClick={handleClose} color="secondary">취소</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BanMember;
