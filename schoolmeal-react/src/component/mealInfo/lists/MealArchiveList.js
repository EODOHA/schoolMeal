import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../../Constants';

function MealArchiveList() {
    const [archives, setArchives] = useState([]);
    const [loading, setLoading] = useState(true);
   

    useEffect(() => {
        axios.get(`${SERVER_URL}mealArchive`)
            .then(response => {
                console.log("불러온 archive 데이터 : ", response.data);
                setArchives(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    return (

        <div className='meal-archive-list'>
            {loading ? (
                <p>데이터를 불러오는 중...</p>
            ) : (
                <>
                    <h2 style={{ textAlign: "center"}}>학교 급식 과거과 현재</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>등록일</th>
                                <th>작성자</th>
                                <th>첨부파일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {archives.map((archive, index) => (
                                <tr key={archive.arc_id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link to={`${SERVER_URL}mealArchive/${archive.arc_id}`}>
                                            {archive.arc_title}
                                        </Link>
                                    </td>
                                    <td>{new Date(archive.createdDate).toLocaleDateString()}</td>
                                    <td>{archive.arc_author || '관리자'}</td>
                                    <td>
                                        {archive.arc_files.map(file => {
                                            const encodedFilename = encodeURIComponent(file.arc_storedFilename);
                                            return(
                                            
                                            <a
                                                key={file.arc_file_id}
                                                href={`${SERVER_URL}mealArchive/download/${encodedFilename}`}
                                                download
                                            >
                                                📂 {file.arc_originalFilename}
                                            </a>
                                            );
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default MealArchiveList;