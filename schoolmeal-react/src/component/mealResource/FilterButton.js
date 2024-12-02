import React, { useState } from 'react';
import { Button, Menu, MenuItem, Stack } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // 아이콘을 MUI에서 제공하는 아이콘으로 변경

function FilterButton({ onFilterChange }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('전체');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectFilter = (filter) => {
        setSelectedFilter(filter);
        handleClose();
        onFilterChange(filter); // 상위 컴포넌트에 선택된 필터 전달
        console.log('선택된 필터:', filter);
    };

    return (
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
            <Button
                variant="contained"
                className="meal-resource-filter-button" // 클래스 추가
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />}
            >
                {selectedFilter}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="meal-resource-filter-menu" // 드롭다운 메뉴에 클래스 추가
            >
                <MenuItem 
                    onClick={() => handleSelectFilter('연령별')} 
                    className="meal-resource-filter-menu-item" // 각 메뉴 항목에 클래스 추가
                >
                    연령별
                </MenuItem>
                <MenuItem 
                    onClick={() => handleSelectFilter('시기별')} 
                    className="meal-resource-filter-menu-item"
                >
                    시기별
                </MenuItem>
                <MenuItem 
                    onClick={() => handleSelectFilter('전체')} 
                    className="meal-resource-filter-menu-item"
                >
                    전체
                </MenuItem>
            </Menu>
        </Stack>
    );
}

export default FilterButton;