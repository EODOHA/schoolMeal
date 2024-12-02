// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { SERVER_URL } from '../../../Constants';
// import { useNavigate, useParams } from "react-router-dom";
// import { Link } from 'react-router-dom';
// import Button from '@mui/material';
// import { MdAttachFile } from "react-icons/md";
// import { BsFileExcel } from "react-icons/bs";


// function MealArchiveList() {
//     const [archives, setArchives] = useState([]);

//     useEffect(() => {
//         axios.get(`${SERVER_URL}MealArchive`)
//             .then(response => setArchives(response.data))
//             .catch(error => console.error(error));
//     }, []);

//     return (
//         <div className="meal-list-container">
//             <h1 className="title">학교급식 과거와 현재</h1>
//             <div className="button-group">
//                 <Button variant="outlined" onClick={() => navigate(" ")} style={{ marginLeft: "auto" }}>
//                     새 글 쓰기
//                 </Button>
//             </div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>번호</th>
//                         <th>제목</th>
//                         <th>등록일</th>
//                         <th>작성자</th>
//                         <th>첨부파일</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {(archives && archives.length === 0) ? (
//                         <tr>
//                             <td colSpan="5">데이터가 없습니다.</td>
//                         </tr>
//                     ) : (
//                         archives && archives.map((archives, index) => {
//                             const isSelected = id && archives.id && id === archives.id.toString();

//                             // fileUrl은 fileId가 존재할 때만 유효한 것으로 처리
//                             // const fileUrl = archives.fileId ? archives._links?.fileUrl?.href : null;

//                             return (
//                                 <tr
//                                     key={archives.id || `archives-${index}`}
//                                     onClick={() => goToDetailPage(archives)}
//                                     style={{
//                                         cursor: "pointer",
//                                         backgroundColor: isSelected ? "#e0f7fa" : "white",
//                                     }}
//                                 >
//                                     <td>{index + 1}</td>
//                                     <td>{archives.title}</td>
//                                     <td>{formatDate(archives.createdDate)}</td>
//                                     <td>{archives.writer}</td>
//                                     <td>
//                                         {fileUrl ? (
//                                             <a href={fileUrl} target="_blank" rel="noopener noreferrer">
//                                                 <span className="attachment-icon"><MdAttachFile /></span>
//                                             </a>
//                                         ) : (
//                                             <span className="attachment-icon"><BsFileExcel /></span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             );
//                         })
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );

// }

// export default MealArchiveList;
