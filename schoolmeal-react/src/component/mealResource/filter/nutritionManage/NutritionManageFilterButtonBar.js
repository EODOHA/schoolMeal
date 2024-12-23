import React, { useState } from "react";
import { Button, Menu, MenuItem, Stack } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { positionTypeEnglish } from "../nutritionManage/PositionUtils";

function NutritionManageFilterBar({ onFilterChange }) {
  const [anchorEl, setAnchorEl] = useState(null); // 필터 메뉴 앵커
  const [selectedFilter, setSelectedFilter] = useState("전체"); // 선택된 필터

  const positions = ["전체", "영양사", "영양교사"]; // 필터 옵션

  // 필터 버튼 클릭 시 메뉴 열기
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 필터 메뉴 닫기
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // 필터 선택 시
  const handleFilterSelect = (position) => {
    const positionType = positionTypeEnglish(position); // 영어로 변환
    setSelectedFilter(position); // 선택된 필터 업데이트
    onFilterChange('직급별', position, positionType); // 상위 컴포넌트로 전달
    handleFilterClose(); // 메뉴 닫기
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        variant="outlined"
        onClick={handleFilterClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          backgroundColor: "#007bff",
          color: "white",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
      >
        {selectedFilter} {/* 선택된 필터 표시 */}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        MenuListProps={{
          "aria-labelledby": "filter-button",
        }}
      >
        {positions.map((option) => (
          <MenuItem key={option} onClick={() => handleFilterSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}

export default NutritionManageFilterBar;