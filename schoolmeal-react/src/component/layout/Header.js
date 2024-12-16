import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Button, Toolbar, Typography, Box, Menu, MenuItem, Drawer, IconButton, DialogContent, DialogActions, Dialog, DialogTitle, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../sign/AuthContext';
import { useNavLinks } from './NavLinksContext'; // NavLinksContext import
import MenuIcon from '@mui/icons-material/Menu'; // 햄버거 아이콘
import SearchIcon from '@mui/icons-material/Search'; // 검색 아이콘
import InputBase from '@mui/material/InputBase';
import '../../css/layout/Header.css';  // Header.css 파일을 import
import { SERVER_URL } from '../../Constants';
import { Block } from '@mui/icons-material';

const Header = ({ setIsMemberManageOpen, setIsProfileUpdateOpen }) => {  // setIsMemberManageOpen을 props로 받아옴
    // 헤더 이미지 상태.
    const [headerImages, setHeaderImages] = useState([]);

    // 권한 Context 가져오기.
    const { isAuth, isAdmin, memberId, logout } = useAuth();

    const navigate = useNavigate();
    const { navLinks, setSelectedParent } = useNavLinks(); // setSelectedParent를 가져옴

    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [suggestions, setSuggestions] = useState([]); // 자동 완성 추천 목록
    const [selectedIndex, setSelectedIndex] = useState(-1); // 자동 완성 선택 항목.
    const searchBoxRef = useRef(null); // 검색창 ref
    const suggestionsRefs = useRef([]); // 각 항목 참조하기 위한 배열.

    const [drawerOpen, setDrawerOpen] = useState(false); // Drawer 열고 닫기 상태 추가

    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // 화면 너비 상태

    // 비밀번호 관련 상태
    const [password, setPassword] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // 비밀번호 입력 모달 열기.
    const openPasswordModal = () => {
      setPassword(""); // 초기화.
      setErrorMessage(""); // 초기화.
      setIsPasswordModalOpen(true);
    };

    // 비밀번호 입력 모달 닫기.
    const closePasswordModal = () => {
      setIsPasswordModalOpen(false);
    };

    // 비밀번호 입력 핸들러.
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };

    const handlePasswordSubmit = async () => {
      try {
        const res = await fetch(SERVER_URL + 'members/validatePassword', {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify({
            memberId,
            password,
          }),
        });

        if (res.ok) {
          setIsPasswordModalOpen(false);
          setSelectedParent(null);
          setIsProfileUpdateOpen(true);
          setIsMemberManageOpen(false);
          navigate("/profileUpdate");
        } else {
          setErrorMessage("비밀번호가 일치하지 않습니다. 다시 시도해 주세요.");
        }
      } catch (err) {
        console.err("Password validation failed:", err);
        setErrorMessage("오류가 발생했습니다. 다시 시도해 주세요.");
      }
    };

    const token = sessionStorage.getItem("jwt");

    const createHeaders = () => ({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    // 헤더 이미지 정보 불러오기.
    useEffect(() => {
      fetch(SERVER_URL + 'imageManage/header', {
        method: 'GET',
        headers: createHeaders(),
      })
      .then(response => {
        // 응답 상태 코드가 200번 아닐 시, 에러 던짐.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched headerImages:", data);
        setHeaderImages(data);
      })
      .catch(error => {
        console.error("Error fetching headerImages:", error.message);
      });
    }, []); // 컴포넌트 마운트 시, 한 번만 실행.

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

    const handleFindAccount = () => {
      navigate("/findAccount");
    }

    const handleLogout = () => {
      const confirmed = 
        window.confirm("로그아웃 하시겠습니까?\n세션이 종료되며, 메인페이지로 이동합니다.");
      if (confirmed) {
        logout();
        navigate("/main");
      }
    };

    const handleMemberManageClick = () => {
      setSelectedParent(null); // 함수 실행 시, 부모 게시판 초기화.
      setIsMemberManageOpen(true); // 유저관리 관련 메뉴 열기
      setIsProfileUpdateOpen(false);
      navigate("/memberlist");     // 유저관리 페이지로 이동
    };

    const toggleDrawer = (open) => {
      setDrawerOpen(open);  // Drawer 열기/닫기
    };

    // 부모 게시판 클릭 시 해당 부모를 선택하는 함수
    const handleSelectParent = (parent) => {
      setSelectedParent(null);
      setTimeout(() => setSelectedParent(parent), 0); // 선택된 부모를 상태에 저장
      setIsMemberManageOpen(false); // 부모 게시판 선택 시 유저 관리 메뉴 닫기
      setIsProfileUpdateOpen(false); // 부모 게시판 선택 시 마이 페이지 메뉴 닫기
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

    // 검색 관련 함수 ---------------------------------------------------------
    const handleSearchChange = (e) => {
      const query = e.target.value;
      setSearchQuery(query);  // 검색어 변경 처리
      setSelectedIndex(-1); // 검색어 변경마다 인덱스 초기화.

      // 검색어에 맞는 추천 목록 필터링
      if (query) {
        const filteredLinks = findLinks(query);
        setSuggestions(filteredLinks);
      } else {
        setSuggestions([]); // 검색어 없으면 자동완성 목록 초기화.
      }
    };

    // 엔터키 누르면 호출되는 함수.
    const handleSearch = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // 기본 동작(페이지 리로드 등) 방지.
        if (suggestions.length > 0) {
          const targetPath = selectedIndex === -1 ? suggestions[0]?.path : suggestions[selectedIndex]?.path;
          if (targetPath) {
            handleSuggestionClick(targetPath);
          }
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault(); // 기본 동작(페이지 리로드 등) 방지.
        // 아래 방향키 -> 다음 항목 선택.
        setSelectedIndex((prev) => {
          const nextIndex = (prev + 1) % suggestions.length;
          scrollToSuggestion(nextIndex);
          return nextIndex
        }); // 순환.
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = (prev - 1 + suggestions.length) % suggestions.length;
          scrollToSuggestion(nextIndex); // 스크롤 조정
          return nextIndex;
        });
      }
    };

    const scrollToSuggestion = (index) => {
      const ref = suggestionsRefs.current[index];
      if (ref) {
        ref.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    };

    // 자동완성 목록 항목 클릭 시, 해당 게시판으로 이동.
    const handleSuggestionClick = (path) => {
      navigate(path);
      setSearchQuery("");
      setSuggestions([]);
    }

    // 검색어 기반으로 게시판 찾기
    const findLinks = (query) => {
      const matchedLinks = [];
      
      // 검색어에서 공백 제거하고 소문자로 변환
      const normalizedQuery = query.replace(/\s+/g, '').toLowerCase();

      for (const link of navLinks) {
        // label에서도 공백을 제거하고 소문자로 변환
        const normalizedLabel = link.label.replace(/\s+/g, '').toLowerCase();
        
        if (normalizedLabel.includes(normalizedQuery)) {
          matchedLinks.push(link);
        }

        if (link.subLinks) {
          for (const subLink of link.subLinks) {
            const normalizedSubLinkLabel = subLink.label.replace(/\s+/g, '').toLowerCase();
            
            if (normalizedSubLinkLabel.includes(normalizedQuery)) {
              matchedLinks.push(subLink);
            }
          }
        }
      }
      return matchedLinks;
    };

    // 외부 클릭 시 자동 완성 목록 숨기고 검색어 초기화
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchQuery(""); // 검색어 초기화
        setSuggestions([]); // 자동 완성 목록 숨기기
      }
    };

    // 컴포넌트가 마운트될 때 외부 클릭 이벤트 리스너 추가
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // 검색 관련 함수 ---------------------------------------------------------


    return (
      <div className='header-box'>
        <div className="layout-header-image">
          
        </div>
        {/* 로그인 관련 버튼과 환영 메시지가 포함된 박스 */}
        <div className='header-topInner-box'>
          <Link to="/main" className="logo">
            <img className="logo-img" src="/logo.png" alt="Logo" />
          </Link>
          <div className='header-innerImage-box'>
            {/* <img src="./layout/layout-header-image.jpg" alt="헤더_이미지"></img> */}
            {headerImages.length > 0 ? (
                headerImages.map((image, index) => (
                    <img
                        key={image.id || index} // 고유 key 추가.
                        src={image.url}
                        alt={image.name || "헤더_이미지"}
                    />
                ))
            ) : (
                <p>헤더 이미지가 없습니다. 🧐</p>
            )}
          </div>
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
                  <Button className="findAccount-btn" color="inherit" onClick={handleFindAccount}>
                    계정찾기
                  </Button>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Button className="mng-btn" color="inherit" onClick={handleMemberManageClick}>
                      관리
                    </Button>
                  )}
                  <Button className="logout-btn" color="inherit" onClick={handleLogout}>
                    로그아웃
                  </Button>
                  <Button className="mypage-btn" color="inherit" onClick={openPasswordModal}>
                    마이페이지
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </div>
        <AppBar position="static" className='custom-appbar'>
          <Toolbar className="toolbar">

            <Box className="nav-links">
              {visibleLinks.map((link, index) => (
                <div key={link.path}>
                  <Button
                    color="inherit"
                    onClick={(event) => {
                      if (link.subLinks) {
                        handleMenuOpen(event, index); // 자식 게시판 메뉴 열기.
                      }
                    }} // 부모 게시판 클릭 시 setSelectedParent 호출
                  >
                    {link.label}
                  </Button>

                  {link.subLinks && (
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuIndex === index}
                      onClose={handleMenuClose}
                      disableScrollLock // 스크롤 락 해제.
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
                          onClick={() => {
                            // 자식 게시판 선택 시 부모 게시판을 사이드바에 담기.
                            handleSelectParent(link); 
                            handleMenuClose(); // 메뉴 닫기
                          }}
                          sx= {{
                            height: "50px",
                          }}
                        >
                          {subLink.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </div>
              ))}
            </Box>

            {/* 검색창을 헤더에 추가 ------------------------------------------ */}
            <Box className="search-box" ref={searchBoxRef}>
              <div className="search">
                <div className="search-icon-wrapper">
                  <SearchIcon />
                </div>
                <InputBase
                  className="search-inputBase"
                  placeholder="게시판 검색…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery} // 검색어 상태
                  onChange={handleSearchChange} // 입력값 업데이트
                  onKeyDown={handleSearch} // 엔터 키 처리
                />
              </div>
              {/* 자동 완성 목록 표시 */}
              {suggestions.length > 0 && (
                <List
                  sx={{
                    position: 'absolute',
                    top: '80%',
                    padding: 0,
                    maxHeight: 200,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    position: 'absolute', // 위치를 절대 위치로 설정
                    zIndex: 10, // 다른 요소 위에 표시되도록 설정
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={suggestion.path}
                      ref={(el) => (suggestionsRefs.current[index] = el)}
                      button
                      onClick={() => handleSuggestionClick(suggestion.path)}
                      sx={{
                        padding: '12px 16px',
                        backgroundColor: index === selectedIndex ? '#f0f0f0' : 'transparent', // 선택된 항목 강조
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      <ListItemText
                        primary={suggestion.label}
                        sx={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            {/* 검색창을 헤더에 추가 ------------------------------------------ */}

            {/* 햄버거 버튼 ----------------------------------------------------- */}
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
            {/* 햄버거 버튼 ----------------------------------------------------- */}
          </Toolbar>

          {/* Drawer (햄버거 메뉴 클릭 시 열리는 메뉴) */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => toggleDrawer(false)}
            disableScrollLock
            sx={{
              zIndex: 1301,
              "& .MuiDrawer-paper": {
                width: 300, // Drawer의 기본 너비를 늘림
              },
            }}
          >
            <Box
              role="presentation"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2, // 항목 간의 간격 추가
                padding: 2,
              }}
            >
              {navLinks.map((link) => (
                <Box key={link.path} sx={{ display: "flex", flexDirection: "column" }}>
                  {/* 부모 게시판 */}
                  <Button
                    component={Link}
                    to={link.path}
                    fullWidth
                    sx={{
                      fontWeight: "bold", // 부모 게시판을 강조
                      textAlign: "left",
                      backgroundColor: "#87D669",
                      color: "white",
                      padding: 1,
                      "&:hover": {
                        backgroundColor: "#9fe483",
                      },
                    }}
                    onClick={() => {
                      handleSelectParent(link);
                      toggleDrawer(false);
                    }}
                  >
                    {link.label}
                  </Button>
                  {/* 자식 게시판 */}
                  {link.subLinks && (
                    <Box>
                      {link.subLinks.map((subLink) => (
                        <Button
                          key={subLink.path}
                          component={Link}
                          to={subLink.path}
                          fullWidth
                          sx={{
                            fontWeight: "normal",
                            color: "#555",
                            "&:hover": {
                              backgroundColor: "#ccc"
                            },
                          }}
                          onClick={() => toggleDrawer(false)} // 자식 선택 시 Drawer 닫기
                        >
                          {subLink.label}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Drawer>

          <Dialog open={isPasswordModalOpen} onClose={closePasswordModal}>
            <DialogTitle>비밀번호 확인</DialogTitle>
            <DialogContent
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit(); // Enter 키 입력 시 함수 실행
                }
              }}
            >
              <TextField
                type="password"
                label="비밀번호를 입력해 주세요."
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                error={!!errorMessage}
                helperText={errorMessage}
                variant="outlined" // or "standard" or "filled"
                margin="normal" // 여백 추가
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closePasswordModal} color='secondary'>취소</Button>
              <Button onClick={handlePasswordSubmit} color='primary'>확인</Button>
            </DialogActions>
          </Dialog>
        </AppBar>
      </div>
    );
};

export default Header;
