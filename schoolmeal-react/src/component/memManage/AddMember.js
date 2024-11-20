import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel";
import Button from '@mui/material/Button';

function AddMember(props) {

    const [open, setOpen] = useState(false);
    const [member, setMember] = useState({
        memberName: '',
        memberId: '',
        role: 'GUEST', // 기본값
        email: 'test@test.com',
        phone: '010-1111-1111',
    });

    // 모달 폼 열기
    const handleClickOpen = () => {
        if (window.confirm("[경고] 정말 급한 경우에만 사용하세요! \n비밀번호는 1234로 생성됩니다.")) {
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
        setMember({ memberId: '', role: ''});
        handleClose();
    }

    return(
        <div>
            <Button variant="contained"
                onClick={handleClickOpen}>
                    긴급 추가
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>새 회원</DialogTitle>
                <DialogContent>
                    <input placeholder="아이디를 입력하세요..." name="memberId"
                        value={member.memberId} onChange={handleChange}
                    />
                    <br />
                    <br />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">권한을 선택하세요...</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={member.role || "GUEST"}
                            onChange={handleChange}
                        >
                            <MenuItem value="LINKAGE">LINKAGE</MenuItem>
                            <MenuItem value="MEMBER">MEMBER</MenuItem>
                            <MenuItem value="GUEST">GUEST</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>저장</Button>
                    <Button onClick={handleClose}>취소</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default AddMember;