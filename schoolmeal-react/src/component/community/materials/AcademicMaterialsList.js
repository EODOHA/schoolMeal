import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import "../../../css/community/AcademicMaterialsList.css"; 

const AcademicMaterialsList = () => {
  const [materialsList, setMaterialsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 학술 자료 데이터 불러오기
    const fetchMaterials = async () => {
      try {
        // 수정된 매핑 경로: /crawling/materials
        const response = await axios.get(`${SERVER_URL}crawling/materials`);
        setMaterialsList(Array.isArray(response.data) ? response.data : response.data.items || []);
      } catch (error) {
        console.error('학술 자료 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="materials-list-container">
      <h2>학술 자료</h2>
      <ul className="materials-list">
        {materialsList.map((material, index) => (
          <li key={index} className="material-item">
            {/* 학술 자료 제목 링크 및 HTML 렌더링 */}
            <a href={material.link} target="_blank" rel="noopener noreferrer" className="material-title">
              <span dangerouslySetInnerHTML={{ __html: material.title }} />
            </a>
            {/* 학술 자료 설명 HTML 렌더링 */}
            <p className="material-description">
              <span dangerouslySetInnerHTML={{ __html: material.description }} />
            </p>
            {/* 발행일 표시 */}
            <p className="material-date">발행일: {new Date(material.pubDate).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcademicMaterialsList;