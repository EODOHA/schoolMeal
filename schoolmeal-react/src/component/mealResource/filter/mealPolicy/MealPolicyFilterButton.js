import React, { useState } from "react";
import { Button, Menu, MenuItem, Stack, Popover } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { eduOfficeTypeEnglish } from "../mealPolicy/EduOfficeUtils";

function MealPolicycyFilterButton({ onFilterChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [eduOfficeAnchorEl, setEduOfficeAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("전체");

  const eduOffices = [
    "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
    "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원특별자치도",
    "충청북도", "충청남도", "전북특별자치도", "전라남도", "경상북도",
    "경상남도", "제주특별자치도"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEduOfficeClick = (eduOffice) => {
    const eduOfficeType = eduOfficeTypeEnglish(eduOffice);
    setSelectedFilter(eduOffice);
    onFilterChange('시∙도 교육청', eduOffice, eduOfficeType);
    handleEduOfficeClose();
    handleClose();
  };

  const handleEduOfficeClose = () => {
    setEduOfficeAnchorEl(null);
  };

  return (
    <Stack
      spacing={1}
      direction="row" // 버튼을 수평으로 정렬하려면 추가
      alignItems="center" // 세로 정렬 기준 (start, center, end)
      justifyContent= "flex-start" // 가로 정렬 기준 (flex-start, center, flex-end)
    >
      <Button
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          backgroundColor: "#007bff",
          color: "white",
          margin: "10px", // 버튼을 상하 및 가로 중앙으로 이동
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
      >
        {selectedFilter} {/* selectedFilter로 버튼 텍스트 변경 */}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "filter-button",
          }}
        >
          <MenuItem
            onClick={() => {
              setSelectedFilter("전체");
              onFilterChange("전체", "", "");
              handleClose();
            }}>전체
          </MenuItem>
          <MenuItem onClick={(e) => setEduOfficeAnchorEl(e.currentTarget)}>시∙도 교육청</MenuItem>
        </Menu>
      </Popover>

      {/* 시∙도 교육청 선택 Popover */}
      <Popover
        open={Boolean(eduOfficeAnchorEl)}
        anchorEl={eduOfficeAnchorEl}
        onClose={handleEduOfficeClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            marginTop: -36, // Popover가 버튼 기준 위쪽으로 이동
          },
        }}
      >
        {eduOffices.map((eduOffice) => (
          <MenuItem key={eduOffice} onClick={() => handleEduOfficeClick(eduOffice)}>
            {eduOffice}
          </MenuItem>
        ))}
      </Popover>
    </Stack>
  );
}

export default MealPolicycyFilterButton;
