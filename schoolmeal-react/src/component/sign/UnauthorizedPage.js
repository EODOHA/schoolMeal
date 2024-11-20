import React from 'react';
import { Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  // /main 페이지로 리디렉션
  const handleRedirect = () => {
    navigate('/main');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Typography variant="h5" align="center" gutterBottom>
        접근 권한이 없습니다.
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        이 페이지에 접근하려면 관리자 권한이 필요합니다.
      </Typography>
      
      <Stack spacing={2} alignItems="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRedirect}
          fullWidth
        >
          메인 페이지로 돌아가기
        </Button>
      </Stack>
    </div>
  );
};

export default UnauthorizedPage;
