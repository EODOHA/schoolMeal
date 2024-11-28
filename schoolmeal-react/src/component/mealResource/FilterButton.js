import React, { useState } from 'react';
import { Button, Menu, MenuItem, Stack } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // 아이콘을 MUI에서 제공하는 아이콘으로 변경

function FilterButton() {
    const [anchorEl, setAnchorEl] = useState(null); // 드롭다운을 제어하는 상태
    const [selectedFilter, setSelectedFilter] = useState('전체'); // 기본 텍스트는 '구분'

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // 버튼 클릭 시 드롭다운 열기
    };

    const handleClose = () => {
        setAnchorEl(null); // 드롭다운 닫기
    };

    const handleSelectFilter = (filter) => {
        setSelectedFilter(filter); // 선택된 필터 텍스트로 변경
        handleClose(); // 선택 시 드롭다운 닫기
        console.log('선택된 필터:', filter); // 선택된 필터 출력
    };

    return (
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center"> {/* 버튼을 오른쪽 정렬 */}
            <Button
                variant="contained"
                color="success"
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />} // MUI 아이콘 사용
            >
                {selectedFilter} {/* 버튼 텍스트를 선택된 필터로 업데이트 */}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleSelectFilter('연령별')}>연령별</MenuItem>
                <MenuItem onClick={() => handleSelectFilter('시기별')}>시기별</MenuItem>
                <MenuItem onClick={() => handleSelectFilter('전체')}>전체</MenuItem>
            </Menu>
        </Stack>
    );
}

export default FilterButton;
