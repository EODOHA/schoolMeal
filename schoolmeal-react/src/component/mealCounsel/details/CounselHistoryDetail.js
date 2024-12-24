// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { SERVER_URL } from '../../../Constants';
// import { useParams, Link } from 'react-router-dom';
// import { useAuth } from '../../sign/AuthContext';
// import Button from '@mui/material/Button';
// import '../../../css/mealCounsel/CounselHistoryDetail.css';

// function CounselHistoryDetail() {
//   const { id } = useParams();
//   const { token } = useAuth();
//   const [history, setHistory] = useState(null);

//   useEffect(() => {
//     fetchCounselHistory();
//   }, [id]);

//   const fetchCounselHistory = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}counselHistory/${id}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token,
//         },
//       });
//       setHistory(response.data);
//     } catch (error) {
//       console.error('상담 기록을 가져오는 중 오류 발생:', error);
//     }
//   };

//   if (!history) return <div>로딩 중...</div>;

//   return (
//     <div className="counsel-history-detail">
//       <h2>상담 기록 상세</h2>
//       <p><strong>ID:</strong> {history.id}</p>
//       <p><strong>제목:</strong> {history.title}</p>
//       <p><strong>작성자:</strong> {history.author}</p>
//       <p><strong>상담 내용:</strong> {history.counselContent}</p>
//       <p><strong>상담 결과:</strong> {history.counselResult}</p>
//       <p><strong>중요 사항:</strong> {history.significant}</p>
//       <p><strong>학생 이력:</strong> {history.studentHistory}</p>
//       <p><strong>상담 날짜:</strong> {history.counselDate}</p>
//       <Button variant="contained" color="primary" component={Link} to="/">
//         목록으로 돌아가기
//       </Button>
//     </div>
//   );
// }

// export default CounselHistoryDetail;
