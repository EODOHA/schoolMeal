import React, { useState } from 'react';
import { SERVER_URL } from "../../../../Constants";
import { useAuth } from '../../../sign/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import '../../../../css/mainManage/AdminNoticeManagerWrite.css';

const AdminNoticeManagerWrite = () => {
    const [newNotice, setNewNotice] = useState({ title: '', content: '', author: '' });
    const [file, setFile] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNotice((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // 파일 상태 업데이트.
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', newNotice.title);
        formData.append('content', newNotice.content);

        if (file) {
            formData.append('file', file); // 파일이 있으면 파일 추가.
        }

        fetch(SERVER_URL + 'adminNotice', {
            method: "POST",
            headers: {
                // 'Content-Type': 'application/json' 자동 처리.
                'Authorization': token,
            },
            body: formData,
        })
        .then(() => {
            alert("공지사항이 추가되었습니다.");
            navigate('/adminNoticeManager');
        });
    };

    return (
        <div className="admin-notice-write-container">
            <div className="admin-notice-card">
                <div className="admin-notice-card-body">
                    <h2 className="admin-notice-title">메인 공지사항 추가</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="admin-notice-form-group">
                            <TextField
                                label="제목"
                                fullWidth
                                name="title"
                                value={newNotice.title}
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
                                value={newNotice.content}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* 첨부파일 입력 추가. */}
                        <div className="admin-notice-form-group">
                            <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                                첨부파일 (선택)
                            </p>
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

                        <div className="admin-notice-button-group">
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                저장
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

export default AdminNoticeManagerWrite;
