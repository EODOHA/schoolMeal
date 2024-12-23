import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button, Menu, MenuItem, Stack, Popover, TextField, InputAdornment } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function SearchBar({ onFilterChange }) {
    const [searchQuery, setSearchQuery] = useState("");  // 검색어 상태
    const [anchorEl, setAnchorEl] = useState(null);  // 필터 메뉴 앵커
    const [selectedFilter, setSelectedFilter] = useState("전체");  // 선택된 필터

    const filterOptions = ["전체", "제목", "작성자", "내용"];  // 필터 옵션

    // 검색어가 변경될 때마다 호출
    const handleSearchChange = (e) => {
        const newSearchQuery = e.target.value; // 검색어 상태 업데이트
        setSearchQuery(newSearchQuery);
        onFilterChange(selectedFilter, newSearchQuery);  // 필터와 검색어에 맞춰 필터 적용
    };

    // 필터 메뉴가 클릭되었을 때
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);  // 필터 메뉴 열기
    };

    // 필터 메뉴를 닫을 때
    const handleFilterClose = () => {
        setAnchorEl(null);  // 필터 메뉴 닫기
    };

    // 필터를 선택했을 때
    const handleFilterChange = (filterType) => {
        setSelectedFilter(filterType);  // 선택된 필터로 업데이트
        onFilterChange(filterType, searchQuery);  // 선택된 필터와 현재 검색어로 필터 적용
        handleFilterClose();  // 메뉴 닫기
    };

    return (
        <div className="bulletin-board-search">
            {/* 필터 선택 메뉴 */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                className="bulletin-board-search-popover"
            >
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleFilterClose}
                    MenuListProps={{
                        "aria-labelledby": "filter-button",
                    }}
                >
                    {filterOptions.map((option) => (
                        <MenuItem key={option} onClick={() => handleFilterChange(option)}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </Popover>

            <Stack direction="row" spacing={1} alignItems="center">
                <Button
                    variant="outlined"
                    onClick={handleFilterClick}  // 필터 버튼 클릭 시 메뉴 열기
                    endIcon={<ArrowDropDownIcon />}
                    className="bulletin-board-search-button"  // 스타일 적용
                >
                    {selectedFilter} {/* 선택된 필터를 버튼 텍스트로 표시 */}
                </Button>

                <TextField
                    variant="outlined"
                    placeholder="검색어를 입력하세요."
                    value={searchQuery}
                    onChange={handleSearchChange}  // 검색어 입력 시 처리
                    className="bulletin-board-search-input"  // 스타일 적용
                    sx={{ flexGrow: 1 }}  // 검색창을 왼쪽에 위치하게 설정
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaSearch />  {/* 검색 아이콘을 입력창 안에 추가 */}
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
        </div>
    );
}

export default SearchBar;
