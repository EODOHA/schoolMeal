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
import { Box } from "@mui/material";

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
                // 1개월 후의 시간을 구할 때 getTime()을 사용하여 정확한 계산
                banEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);  // 1개월 후 (대략 30일 기준)
                break;
            case 'permanent':
                banEndDate = new Date(9999, 11, 31); // 영구 차단
                break;
            default:
                banEndDate = null;
                break;
        }

        return banEndDate ? new Date(
            banEndDate.getTime() - banEndDate.getTimezoneOffset() * 60000).toISOString()
            : null;
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <DoNotTouchIcon color="error"/>
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>회원 차단 설정</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        회원을 차단할 기간을 선택하세요.
                    </DialogContentText>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        차단된 회원은 차단 해제 전까지 로그인이 불가능하며,
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        잠금도 함께 해제됩니다.
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            value={banDuration}
                            onChange={handleBanDurationChange}
                            displayEmpty
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: '4px',
                                boxShadow: 1,
                                '& .MuiSelect-icon': { color: 'primary.main' }
                            }}
                        >
                            <MenuItem value="10sec">10초(테스트용)</MenuItem>
                            <MenuItem value="1d">1일</MenuItem>
                            <MenuItem value="7d">7일</MenuItem>
                            <MenuItem value="1m">30일</MenuItem>
                            <MenuItem value="permanent">영구 차단</MenuItem>
                            <MenuItem value="default" sx={{ color: 'blue' }}>차단 해제</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={handleSave} color="primary" variant="contained" sx={{ fontWeight: 'bold' }}>설정</Button>
                    <Button onClick={handleClose} color="secondary" variant="outlined" sx={{ fontWeight: 'bold' }}>취소</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BanMember;
