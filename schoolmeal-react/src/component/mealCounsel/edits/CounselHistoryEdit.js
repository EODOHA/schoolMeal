// // src/components/counselHistory/edit/CounselHistoryEdit.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { SERVER_URL } from '../../../Constants';
// import { useParams, useNavigate } from 'react-router-dom';
// import Button from '@mui/material/Button';
// import '../../../css/mealCounsel/CounselHistoryEdit.css';

// function CounselHistoryEdit() {
//   const { id } = useParams();
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

//   useEffect(() => {
//     fetchCounselHistory();
//   }, [id]);

//   const fetchCounselHistory = async () => {
//     try {
//       const response = await axios.get(`${SERVER_URL}counselHistory/${id}`);
//       setFormData(response.data);
//     } catch (error) {
//       console.error('상담 기록을 가져오는 중 오류 발생:', error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${SERVER_URL}counselHistory/${id}`, formData);
//       alert('상담 기록이 성공적으로 업데이트되었습니다!');
//       navigate(`/detail/${id}`);
//     } catch (error) {
//       console.error('상담 기록 업데이트 중 오류 발생:', error);
//       alert('상담 기록 업데이트에 실패했습니다.');
//     }
//   };

//   return (
//     <div className="counsel-history-edit">
//       <h2>상담 기록 수정</h2>
//       <form onSubmit={handleSubmit} className="edit-form">
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
//           상담 기록 업데이트
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
//           취소
//         </Button>
//       </form>
//     </div>
//   );
// }

// export default CounselHistoryEdit;
