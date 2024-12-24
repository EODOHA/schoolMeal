/*식생활 진단 페이지 이동 링크*/
import React from 'react';
import {SERVER_URL} from '../../../Constants';
import { Button } from '@mui/material';

function CounselMain() {
    const handleButtonClick = () => {
        window.location.href = SERVER_URL + 'goToCounsel';
    };

    return (
        <div>
            <h1>영양상담 진단</h1>
            {/* 기존 링크 대신 또는 추가로 버튼을 사용 */}
            <Button variant="contained" color="primary" onClick={handleButtonClick}>식생활진단페이지로 이동</Button>
        </div>
    );
}

export default CounselMain;