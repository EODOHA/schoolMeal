import React, { useState } from 'react';
import SchoolSearch from '../edits/SchoolSearch.js';
import MealMenuDetail from '../details/MealMenuDetail.js';

// 학교별 급식 식단정보 메인
function MealMenuMain() {
  const [selectedSchool, setSelectedSchool] = useState(null);


  return (
    <div>
      <h1 style={{ textAlign: "center" }}>학교 급식 조회</h1>
      {/* 학교 선택 */}
      <SchoolSearch onSchoolSelect={setSelectedSchool} />
      {/* 학교 선택 후 선택된 학교에 대한 급식 정보 조회 */}
      {selectedSchool && <MealMenuDetail school={selectedSchool} />}
    </div>

  );
}
export default MealMenuMain;