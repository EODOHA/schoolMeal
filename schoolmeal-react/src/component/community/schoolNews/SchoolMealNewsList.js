import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from "../../../Constants";
import "../../../css/community/SchoolMealNewsList.css"; 
import SchoolMealNewsAnalyzer from '../../artificial_intelligence/SchoolMealNewsAnalyzer';

const SchoolMealNewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 급식 뉴스 데이터 가져오기
    const fetchNews = async () => {
      try {
        // 수정된 매핑 경로: /crawling/school-news
        const response = await axios.get(`${SERVER_URL}crawling/school-news`);
        setNews(Array.isArray(response.data) ? response.data : response.data.items || []);
      } catch (error) {
        console.error('급식 뉴스 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="news-list-container">
      <SchoolMealNewsAnalyzer />
      <h2>급식 뉴스</h2>
      <ul className="news-list">
        {news.map((item, index) => (
          <li key={index} className="news-item">
            {/* 뉴스 제목 링크 및 HTML 렌더링 */}
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-title">
              <span dangerouslySetInnerHTML={{ __html: item.title }} />
            </a>
            {/* 뉴스 설명 HTML 렌더링 */}
            <p className="news-description">
              <span dangerouslySetInnerHTML={{ __html: item.description }} />
            </p>
            {/* 뉴스 발행일 표시 */}
            <p className="news-date">발행일: {new Date(item.pubDate).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchoolMealNewsList;