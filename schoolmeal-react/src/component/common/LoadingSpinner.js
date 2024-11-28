// LoadingSpinner.js
import React from 'react';
import LoopIcon from '@mui/icons-material/Loop';
import '../../css/common/LoadingSpinner.css';  // 스타일을 분리하여 적용

function LoadingSpinner() {
    return (
        <div className="loading-container">
            <LoopIcon sx={{ fontSize: 50, color: 'primary.main'}} className="rotating-icon" />
            로딩 중...
        </div>
    );
}

export default LoadingSpinner;