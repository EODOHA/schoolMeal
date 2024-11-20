import React, { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, Typography, Box, Menu, MenuItem, Drawer, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../sign/AuthContext';
import { useNavLinks } from './NavLinksContext'; // NavLinksContext import
import MenuIcon from '@mui/icons-material/Menu'; // 햄버거 아이콘
import SearchIcon from '@mui/icons-material/Search'; // 검색 아이콘
import InputBase from '@mui/material/InputBase';
import '../../css/layout/Header.css';  // Header.css 파일을 import

const Header = ({ setIsMemberManageOpen }) => {  // setIsMemberManageOpen을 props로 받아옴
  const { isAuth, isAdmin, memberId, logout } = useAuth();
  const navigate = useNavigate();
  const { navLinks, setSelectedParent } = useNavLinks(); // setSelectedParent를 가져옴

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");  // 검색어 상태 추가
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer 열고 닫기 상태 추가
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // 화면 너비 상태

  // 화면 크기 변화 감지 (가로 크기)
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize); // 화면 크기 변경 시 이벤트 리스너 추가
    return () => window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 리스너 제거
  }, []);

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuIndex(null);
  };

  const handleLogin = () => {
    navigate("/"); // 로그인 종류 선택으로 이동
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?\n세션이 종료되며, 메인페이지로 이동합니다.");
    if (confirmed) {
      logout();
      navigate("/main");
    }
  };

  const handleMemberManageClick = () => {
    setSelectedParent(null); // 함수 실행 시, 부모 게시판 초기화.
    setIsMemberManageOpen(true); // 유저관리 관련 메뉴 열기
    navigate("/memberlist");     // 유저관리 페이지로 이동
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);  // 검색어 변경 처리
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);  // Drawer 열기/닫기
  };

  // 부모 게시판 클릭 시 해당 부모를 선택하는 함수
  const handleSelectParent = (parent) => {
    setSelectedParent(null);
    setTimeout(() => setSelectedParent(parent), 0); // 선택된 부모를 상태에 저장
    setIsMemberManageOpen(false); // 부모 게시판 선택 시 유저 관리 메뉴 닫기
  };

  // 화면 크기에 따라 표시할 navLinks의 수를 제한
  const getVisibleLinks = () => {
    if (screenWidth <= 600) {
      return navLinks.slice(0, 3); // 600px 이하에서는 2개 링크만
    } else if (screenWidth <= 800) {
      return navLinks.slice(0, 4); // 800px 이하에서는 3개 링크만
    } else if (screenWidth <= 1000) {
      return navLinks.slice(0, 5); // 1000px 이하에서는 4개 링크만
    } else if (screenWidth <= 1200) {
      return navLinks.slice(0, 6); // 1200px 이하에서는 5개 링크만
    } else {
      return navLinks; // 1000px 이상에서는 모든 링크 표시
    }
  };

  const visibleLinks = getVisibleLinks(); // 조건에 맞는 navLinks를 가져옴

  return (
    <div className='header-box'>
      <Link to="/main" className="logo">
        <img className="logo-img" src="/logo.png" alt="Logo" />
      </Link>
      <AppBar position="static" className='custom-appbar'>
        <Toolbar className="toolbar">

          <Box className="nav-links">
            {visibleLinks.map((link, index) => (
              <div key={link.path}>
                <Button
                  color="inherit"
                  onClick={() => handleSelectParent(link)} // 부모 게시판 클릭 시 setSelectedParent 호출
                >
                  {link.label}
                </Button>

                {link.subLinks && (
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenuIndex === index}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    {link.subLinks.map((subLink) => (
                      <MenuItem
                        key={subLink.path}
                        component={Link}
                        to={subLink.path}
                        onClick={handleMenuClose}
                      >
                        {subLink.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </div>
            ))}
          </Box>

          {/* 검색창을 헤더에 추가 */}
          <Box className="search-box">
            <div className="search">
              <div className="search-icon-wrapper">
                <SearchIcon />
              </div>
              <InputBase className="search-inputBase"
                placeholder="검색…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange} // 검색어 입력 시 상태 업데이트
                // sx={{
                  
                // }}
              />
            </div>
          </Box>

          {/* 햄버거 버튼 */}
          <Box className="hamburger-box">
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)} // Drawer 열기
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '20px',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* 로그인 관련 버튼과 환영 메시지가 포함된 박스 */}
          <Box className="auth-buttons">
            {isAuth && (
              <Typography className="welcome-message">
                {memberId}님 환영합니다!
              </Typography>
            )}

            <Box className="button-group">
              {!isAuth ? (
                <>
                  <Button className="log-btn" color="inherit" onClick={handleLogin}>
                    로그인
                  </Button>
                  <Button className="sign-btn" color="inherit" onClick={handleSignup}>
                    회원가입
                  </Button>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Button className="mng-btn" color="inherit" onClick={handleMemberManageClick}>
                      유저관리
                    </Button>
                  )}
                  <Button className="logout-btn" color="inherit" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>

        {/* Drawer (햄버거 메뉴 클릭 시 열리는 메뉴) */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <Box
            sx={{ width: 200 }}
            role="presentation"
            onClick={() => toggleDrawer(false)}
            onKeyDown={() => toggleDrawer(false)}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                fullWidth
                sx={{ padding: 2 }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Drawer>
      </AppBar>
    </div>
  );
};

export default Header;