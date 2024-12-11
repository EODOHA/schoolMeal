import React, { useState, useEffect } from 'react';
import { SERVER_URL } from "../../../../Constants";
import { useAuth } from '../../../sign/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import '../../../../css/mainManage/AdminNoticeManagerEdit.css';

const AdminNoticeManagerEdit = () => {
    const [notice, setNotice] = useState({ title: '', content: ''});
    const [file, setFile] = useState(null);
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${SERVER_URL}adminNotice/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setNotice({
                title: data.title || '',
                content: data.content || '',
                fileName: data.fileName || '',
            });
        })
        .catch((error) => {
            console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
        });
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotice((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', notice.title);
        formData.append('content', notice.content);

        // 새 파일이 있다면, 이를 폼 데이터에 추가.
        if (file) {
            formData.append('file', file);
        }

        fetch(`${SERVER_URL}adminNotice/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': token,
            },
            body: formData,
        })
        .then(() => {
            alert("공지사항이 수정되었습니다.");
            navigate('/adminNoticeManager');
        })
        .catch((error) => {
            console.error("공지사항 수정 중 오류가 발생했습니다.", error);
            alert("공지사항 수정에 실패했습니다.");
        });
    };

    const handleFileDelete = () => {
        const isConfirmed = window.confirm("첨부파일을 삭제 하시겠습니까?\n[수정]을 누르지 않아도 바로 적용됩니다.")

        if (isConfirmed) {
            fetch(`${SERVER_URL}adminNotice/deleteFile/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            })
            .then((res) => {
                if (res.ok) {
                    setNotice((prevNotice) => ({
                        ...prevNotice,
                        fileName: '',
                    }));
                    alert("첨부파일이 삭제되었습니다.");
                } else {
                    alert("첨부파일 삭제에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("첨부파일 삭제 중 오류가 발생했습니다.", error);
                alert("첨부파일 삭제에 실패했습니다.");
            });
        } else {
            alert("삭제가 취소되었습니다.");
        }
    };

    return (
        <div className="admin-notice-write-container">
            <div className="admin-notice-card">
                <div className="admin-notice-card-body">
                    <h2 className="admin-notice-title">메인 공지사항 수정</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="admin-notice-form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                name="title"
                                value={notice.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="admin-notice-form-group">
                            <TextField
                                label="내용"
                                fullWidth
                                multiline
                                rows={1}
                                name="content"
                                value={notice.content}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="admin-notice-form-group">
                        {/* 기존 첨부파일 표시 */}
                        {notice.fileName && (
                            <div className="existing-file-section">
                                <p style={{ margin: "10px 0", fontWeight: "bold" }}>기존 첨부파일</p>
                                <div className="file-display">
                                    <a 
                                        href={`${SERVER_URL}adminNotice/download/${notice.fileName}`} 
                                        download 
                                        className="file-link"
                                    >
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            size="small"
                                            style={{ textTransform: 'none' }}
                                        >
                                            {notice.fileName}
                                        </Button>
                                    </a>
                                    {/* 삭제 버튼 추가 */}
                                    <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={handleFileDelete}
                                            style={{ marginLeft: '10px' }}
                                    >
                                        파일 삭제
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* 새 파일 첨부 */}
                        <div className="new-file-section">
                            <p style={{ margin: "10px 0", fontWeight: "bold" }}>새 첨부파일 (선택)</p>
                            <input
                                type="file"
                                accept="*/*"
                                onChange={handleFileChange}
                                style={{
                                    border: "1px dashed #ccc",
                                    padding: "10px",
                                    borderRadius: "5px",
                                    width: "100%",
                                    display: "block",
                                    marginBottom: "10px",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>

                        <div className="admin-notice-button-group">
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                수정
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/adminNoticeManager")}
                            >
                                목록
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminNoticeManagerEdit;
