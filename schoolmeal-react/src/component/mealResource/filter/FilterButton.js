import React, { useState } from "react";
import { Button, Menu, MenuItem, Stack, Popover } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { seasonTypeEnglish } from "../filter/seasonUtils";

function FilterButton({ onFilterChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [ageAnchorEl, setAgeAnchorEl] = useState(null);
  const [seasonAnchorEl, setSeasonAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("전체");

  const ageGroups = ["10대 이하", "10대", "20대", "30대", "40대", "40대 이상"];
  const seasons = ["봄", "여름", "가을", "겨울", "기타(사계절)"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAgeGroupClick = (ageGroup) => {
    setSelectedFilter('연령별');
    onFilterChange('연령별', ageGroup, ''); 
    handleAgeGroupClose();
    handleClose();
  };

  const handleAgeGroupClose = () => {
    setAgeAnchorEl(null);
  };

  const handleSeasonClick = (season) => {
    const seasonType = seasonTypeEnglish(season);
    setSelectedFilter(season);  // 선택된 시즌을 selectedFilter로 업데이트
    onFilterChange('시기별', '', seasonType); // 필터 변경
    handleSeasonClose();
    handleClose();
  };

  const handleSeasonClose = () => {
    setSeasonAnchorEl(null);
  };

  return (
    <Stack spacing={1}>
      <Button
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          backgroundColor: "#007bff",  // 배경색 설정
          color: "white",              // 글자 색을 흰색으로 설정 (배경과 대비되게)
          "&:hover": {
            backgroundColor: "#0056b3", // 호버시 배경색 변경 (더 어두운 파란색)
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
          horizontal: "center"
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
          <MenuItem onClick={() => onFilterChange("전체", "", "")}>전체</MenuItem>
          <MenuItem onClick={(e) => setAgeAnchorEl(e.currentTarget)}>연령별</MenuItem>
          <MenuItem onClick={(e) => setSeasonAnchorEl(e.currentTarget)}>시기별</MenuItem>
        </Menu>
      </Popover>

      {/* 연령대 선택 Popover */}
      <Popover
        open={Boolean(ageAnchorEl)}
        anchorEl={ageAnchorEl}
        onClose={handleAgeGroupClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {ageGroups.map((ageGroup) => (
          <MenuItem key={ageGroup} onClick={() => handleAgeGroupClick(ageGroup)}>
            {ageGroup}
          </MenuItem>
        ))}
      </Popover>

      {/* 시기별 선택 Popover */}
      <Popover
        open={Boolean(seasonAnchorEl)}
        anchorEl={seasonAnchorEl}
        onClose={handleSeasonClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {seasons.map((season) => (
          <MenuItem key={season} onClick={() => handleSeasonClick(season)}>
            {season}
          </MenuItem>
        ))}
      </Popover>
    </Stack>
  );
}

export default FilterButton;
