// // src/components/counselHistory/write/CounselHistoryWrite.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { SERVER_URL } from '../../../Constants';
// import { useAuth } from '../../sign/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Button from '@mui/material/Button';
// import '../../../css/mealCounsel/CounselHistoryWrite.css';


// function CounselHistoryWrite() {
//   const { token } = useAuth();
//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     counselContent: '',
//     counselResult: '',
//     significant: '',
//     studentHistory: '',
//     counselDate: ''
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${SERVER_URL}counselHistory/counselwrite`, formData,{
//         headers: {
//           Authorization: `${token}`, // 인증 토큰 Bearer 스킴 사용
//       },
//   });
//       alert('상담 기록이 성공적으로 추가되었습니다!');
//       navigate("/counselHistory/counsellist");
//     } catch (error) {
//       console.error('상담 기록 추가 중 오류 발생:', error);
//       alert('상담 기록 추가에 실패했습니다.');
//     }
//   };

//   return (
//     <div className="counsel-history-write">
//       <h2>상담 기록 추가</h2>
//       <form onSubmit={handleSubmit} className="write-form">
//         <div>
//           <label>제목:</label><br />
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>작성자:</label><br />
//           <input
//             type="text"
//             name="author"
//             value={formData.author}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>상담 내용:</label><br />
//           <textarea
//             name="counselContent"
//             value={formData.counselContent}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label>상담 결과:</label><br />
//           <textarea
//             name="counselResult"
//             value={formData.counselResult}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>중요 사항:</label><br />
//           <textarea
//             name="significant"
//             value={formData.significant}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>학생 이력:</label><br />
//           <textarea
//             name="studentHistory"
//             value={formData.studentHistory}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>상담 날짜:</label><br />
//           <input
//             type="date"
//             name="counselDate"
//             value={formData.counselDate}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <Button variant="contained" color="primary" type="submit">
//           상담 기록 추가
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
//           취소
//         </Button>
//       </form>
//     </div>
//   );
// }

// export default CounselHistoryWrite;
