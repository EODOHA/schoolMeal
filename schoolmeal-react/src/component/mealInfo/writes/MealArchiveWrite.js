import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import '../../../css/mealInfo/MealInfoWrite.css';
import { useAuth } from '../../sign/AuthContext';

function MealArchiveWrite({ writeArchive, error, handleBackToList }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { role, memberId, isAdmin, isBoardAdmin } = useAuth();  //현재 로그인한 사용자의 memberId, 게시판 담당자 이상 권한 여부 가져오기

    //컴포넌트가 처음 렌더링될 때 author를 권한에 따라 다르게 설정
    useEffect(() => {
        let arcAuthor = role; //
        // console.log(role);
        // console.log(isBoardAdmin);

        if (isAdmin) {
            arcAuthor = "관리자";
        } else if (isBoardAdmin) {
            arcAuthor = "담당자";
        }

        setAuthor(arcAuthor);

    }, [memberId, role, isAdmin, isBoardAdmin]);

    // 파일 입력 변경 핸들러
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();     // 페이지 새로고침 방지
        setLoading(true);

        const newArchive = {
            arc_title: title,
            arc_content: content,
            arc_author: author,
        };

        try {
            await writeArchive(newArchive, file);
            setLoading(false); // 성공 시 로딩 상태 해제
        } catch (error) {
            setLoading(false) // 오류 발생 시 로딩상태 해제
            // console.error(error);
        }
    };

    return (
        <div className='meal-info-write-container'>
            <div className='meal-info-card'>
                <h2>새 글 작성</h2>
                {error}
                <form onSubmit={handleSubmit}>

                    <div className='meal-info-form-group'>
                        <TextField
                            label="제목"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="meal-info-form-group">
                        <TextField
                            label="작성자"
                            fullWidth
                            value={author}
                            required
                            read-only="true"
                        />
                    </div>
                    <div className='meal-info-form-group'>
                        <TextField
                            label="내용"
                            fullWidth
                            multiline
                            rows={1}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="meal-info-form-group">
                        <label>첨부파일:</label>
                        <input
                            type="file"
                            // accept="image/*, .pdf, .docx"  허용할 파일 형식
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="meal-info-button-group">
                        <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "등록 중..." : "등록"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleBackToList} //목록 버튼 클릭 시 목록으로 이동
                        >
                            목록
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MealArchiveWrite;