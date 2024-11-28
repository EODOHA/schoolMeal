import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../sign/AuthContext";
import { SERVER_URL } from "../../Constants";
import { DataGrid } from "@mui/x-data-grid";
import { Skeleton } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import AddMember from "./AddMember";  // AddMember 컴포넌트 import
import EditMember from "./EditMember";
import BanMember from "./BanMember";
import '../../css/memberManagement/Memberlist.css';
import IconButton from "@mui/material/IconButton";
import DeleteIcone from "@mui/icons-material/Delete";
import LoadingSpinner from "../common/LoadingSpinner";

function Memberlist() {
    
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const { isAuth, authCheck } = useAuth();

    useEffect(() => {
        if (authCheck) {
            return;
        }
        if (!authCheck && !isAuth) {
            window.location.href = "/unauthorized";
            return;
        }
        fetchMembers();
    }, [authCheck, isAuth]);

    const token = sessionStorage.getItem("jwt");

    const columns = [
        { field: 'memberName', headerName: '회원명', width: 90, headerAlign: 'center', align: "center" },
        { field: 'memberId', headerName: '아이디', width: 90, headerAlign: 'center', align: "center", },
        { field: 'email', 
            headerName: '이메일',
            width: 120,
            headerAlign: 'center',
            align: "center",
            renderCell: (row) => {
                const email = row.value || '';
                const [localPart, domainPart] = email.split('@');
                return (
                    <div style={{ textAlign: "center"}}>
                        {localPart}
                        <br/>
                        @{domainPart}
                    </div>
                )
            }
         },
        { 
            field: 'phone',
            headerName: '전화번호', 
            width: 100, 
            headerAlign: 'center', 
            align: "center" ,
            renderCell: (row) => {
                const phone = row.value;

                if (!phone) return "-"; // 전화번호 없으면 "-" 반환

                // 10자리 전화번호 형식: XXX-XXX-XXXX
                if (phone.length === 10) {
                    const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-<br/>$2-$3");
                    return (
                        <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: formattedPhone }} />
                    );
                }

                // 11자리 전화번호 형식: XXX-XXXX-XXXX
                if (phone.length === 11) {
                    const formattedPhone = phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-<br/>$2-$3");
                    return (
                        <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: formattedPhone }} />
                    );
                }
                return phone; // 10자리, 11자리 아니면, 원본 반환.
            }
        },
        { field: 'role', headerName: '권한', width: 80, headerAlign: 'center', align: "center" },
        { field: 'is_locked', headerName: '잠금여부', width: 80, headerAlign: 'center', align: "center" },
        { field: 'status', headerName: '상태', width: 60, headerAlign: 'center', align: "center" },
        { 
            field: 'ban_until', 
            headerName: '차단 기간', 
            width: 135, 
            headerAlign: 'center', 
            align: "center" ,
            renderCell: (row) => {
                const banUntil = row.value;
                if (!banUntil) return "-";

                const date = new Date(banUntil);
                if (isNaN(date.getTime())) {
                    return "-";
                }

                if (date.getFullYear() === 9999) {
                    return <div style={{ textAlign: "center" }}>영구 차단</div>;
                }

                const currentDate = new Date();
                const timeDifference = date - currentDate;
                const daysLeft = Math.floor(timeDifference / (1000 * 3600 * 24));
                const hoursLeft = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));  // 나머지 시간 계산
                const minutesLeft = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));  // 나머지 분 계산

                const formattedDate = 
                    `<div>
                        ${date.getFullYear()}년
                        ${date.getMonth() + 1}월
                        ${date.getDate()}일 <br />
                    </div>
                     <div>
                        ${date.getHours()}시
                        ${date.getMinutes()}분
                        ${date.getSeconds()}초까지
                     </div>
                     <div>
                        <span style="color: red;">
                            ${daysLeft}일
                            ${hoursLeft}시
                            ${minutesLeft}분 남음
                        </span>
                     </div>`;

                     return (
                        <div 
                            style={{ textAlign: "center" }}
                            dangerouslySetInnerHTML={{ __html: formattedDate }}
                        />
                     )
            }    
        },
        {
            field: '_links.member.href',
            headerName: '권한 수정',
            width: 85,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: 'center',
            alignItems: "center",
            renderCell: row => (
                <EditMember
                    data={row}
                    updateMember={updateMember}
                    disabled={row.row.role === 'ADMIN'}
                />
            )
        },
        {
            field: '_links.ban.href',
            headerName: '차단',
            width: 50,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: 'center',
            alignItems: "center",
            renderCell: row => (
                <BanMember
                    data={row}
                    banUpdateMember={banUpdateMember}
                    disabled={row.row.role === 'ADMIN'}
                />
            )
        },
        {
            field: '_links.self.href',
            headerName: '삭제',
            width: 50,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: 'center',
            alignItems: "center",
            renderCell: row => (
                <IconButton
                    onClick={() => {
                        if (row.row.role !== 'ADMIN') {
                            onDelClick(row.id);
                        } else {
                            alert("[경고] ADMIN은 삭제할 수 없습니다!");
                        }
                    }}
                >
                    <DeleteIcone color="error" />
                </IconButton>
            )
        },
        // {
        //     field: 'add_member',
        //     headerName: '긴급 추가',
        //     flex: 1,
        //     sortable: false,
        //     filterable: false,
        //     renderHeader: () => (
        //         <AddMember addMember={addMember} /> // AddMember 폼을 헤더에 넣기
        //     ),
        //     width: 200,
        // },
    ];

    const fetchMembers = useCallback(() => {
        setLoading(true); 
        if (!token) {
            setLoading(false); 
            return;
        }
        
        fetch(SERVER_URL + 'members', {
            headers: createHeaders()
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            let newMembers = [];
            if (data._embedded && data._embedded.members) {
                newMembers = data._embedded.members.map(member => ({
                    ...member,
                    _links: member._links,
                }));
            } else if (Array.isArray(data)) {
                newMembers = data.map(member => ({
                    ...member,
                    _links: member._links,
                }));
            } else {
                console.warn("예상치 못한 데이터 구조:", data);
                newMembers = [];
            }

            setMembers(prevMembers => {
                if (JSON.stringify(newMembers) !== JSON.stringify(prevMembers)) {
                    return newMembers;
                }
                return prevMembers;
            });
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to fetch members:", err);
            setLoading(false);
            if (err.message.includes("401")) {
                alert("인증 오류: 로그인이 필요합니다.");
            } else {
                alert("유저 정보를 가져오는 데 문제가 발생했습니다.");
            }
        });
    }, [token]);

    useEffect(() => {
        if (members.length === 0) {
            // console.log("유저 데이터가 비어 있습니다.")
        }
    }, [members]);

    useEffect(() => {
        if (token) {
            fetchMembers();
        }
    }, [token]);

    const createHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': token
    });

    const onDelClick = (url) => {
        const memberUrl = typeof url === 'number' ? `${SERVER_URL}members/${url}` : url;
        if (window.confirm("정말 회원을 삭제하시겠습니까?")) {
            fetch(memberUrl, {method: 'DELETE', headers: createHeaders()})
                .then(response => {
                    if (response.ok) {
                        fetchMembers();
                        setOpen(true);
                    } else {
                        alert("회원 삭제 중 문제가 발생했습니다!");
                    }
                })
                .catch(err => console.error(err));
        }
    };

    // 긴급 추가 함수.
    const addMember = (member) => {
        // 아이디 공백 체크
        if (!member.memberId.trim()) {
            alert("아이디는 공백일 수 없습니다.");
            window.location.reload();
            return;
        }
        // 아이디 중복 체크
        fetch(SERVER_URL + 'check-duplicate-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: member.memberId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.isAvailable) {
                // 아이디가 사용 가능하다면, 회원 추가
                fetch(SERVER_URL + 'members', {
                    method: 'POST',
                    headers: createHeaders(),
                    body: JSON.stringify(member)
                })
                .then(response => {
                    if (response.ok) {
                        // console.log("사용자 추가 성공");
                        return response.json();
                    } else {
                        // console.error("응답 상태 문제:", response.status);
                        alert("긴급 추가 중 문제가 발생했습니다!");
                    }
                })
                .then(newMember => {
                    // 새로운 멤버 추가 시 기존 members 데이터가 제대로 처리되었는지 확인
                    setMembers(prevMembers => {
                        // prevMembers에서 undefined가 없도록 필터링
                        const updatedMembers = [...prevMembers, newMember].filter(item => item !== undefined);
                        return updatedMembers;
                    });
                })
                .catch(err => console.error("네트워크 에러:", err));
            } else {
                // 중복된 아이디일 경우 경고 메시지 출력
                alert("이미 사용 중인 아이디입니다.");
                window.location.reload(); // 페이지 새로 고침.
            }
        })
        .catch(err => {
            // console.error("아이디 중복 체크 실패:", err);
            alert("아이디 중복 체크 중 문제가 발생했습니다.");
        });
    };

    // 권한 설정 함수.
    const updateMember = (updatedMember, link) => {
        const memberLink = typeof link === 'number' ? `${SERVER_URL}members/${link}` : link;
        
        const existingMember = typeof link === 'number' 
            ? members.find(member => member.id === link)
            : members.find(member => member._links?.self?.href === memberLink);

        if (!existingMember) {
            console.error("해당 사용자를 찾을 수 없습니다.");
            alert("해당 사용자를 찾을 수 없습니다.");
            return;
        }

        const updatedData = {
            ...existingMember,
            role: updatedMember.role,
            password: existingMember.password
        };

        fetch(memberLink, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (response.ok) {
                fetchMembers();
            } else {
                response.text().then(text => {
                    console.error("서버 응답 오류:", response.status, text);
                    alert("권한 설정 중 문제가 발생했습니다!");
                });
            }
        })
        .catch(err => {
            console.error("에러 발생:", err);
            alert("권한 설정 중 오류가 발생했습니다.");
        });
    };

    // 차단 설정 함수.
    const banUpdateMember = (ban, link) => {
        const memberLink = typeof link === 'number' ? `${SERVER_URL}members/${link}` : link;
        
         // 기존 멤버 정보 가져오기
        const existingMember = typeof link === 'number'
        ? members.find(member => member.id === link)
        : members.find(member => member._links?.self?.href === memberLink);

        if (!existingMember) {
            console.error("해당 사용자를 찾을 수 없습니다.");
            alert("해당 사용자를 찾을 수 없습니다.");
            return;
        }

        const updatedData = {
            ...existingMember, // 기존 데이터 유지.
            banUntil: ban.banUntil,
            status: ban.banUntil ? "banned" : "active"
        };
        
        fetch(memberLink, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (response.ok) {
                fetchMembers();
            } else {
                alert("차단 설정 중 문제가 발생했습니다!");
            }
        })
        .catch(err => {
            console.error("에러 발생:", err);
            alert("차단 설정 중 오류가 발생했습니다.");
        });
    };

    const membersData = members.map(member => {
        return {
            ...member,
            status: member.locked || member.banUntil ? "banned" : "active",
            ban_until: member.banUntil ? member.banUntil : "없음",
            is_locked: member.banUntil || member.locked ? "잠금" : "미잠금"
        };
    });

    return (
        <React.Fragment>
            <div className="layout-container">
                <div className="data-grid-box">
                    {loading ? (
                        <LoadingSpinner />
                    ) : membersData.length === 0 ? (
                        <div>유저 정보가 알 수 없는 이유로 비어있는 상태입니다!</div>
                    ) : (
                        <div>
                            {/* Skeleton 컴포넌트로 로딩 화면을 표시 */}
                            <Skeleton variant="rectangular" width="100%" height={10} />
                            
                            {/* DataGrid 로딩 후 표시 */}
                            <DataGrid 
                                rows={membersData} 
                                columns={columns}
                                getRowId={(row) => row._links ? row._links.self.href : row.memberId}
                                columnHeaderHeight={30} // 헤더 높이 조절
                                density="comfortable" // 밀도 조정
                                getRowHeight={() => 'auto'}
                                pagination // 페이지네이션 기능 활성화
                                sx={{
                                    // transformOrigin: 'center left', // 축소 기준점을 왼쪽 상단으로 설정
                                    // width: '100%',
                                    '& .MuiDataGrid-columnHeaders': {
                                        display: 'flex', // 헤더를 flex로 설정
                                        justifyContent: 'space-between', // 헤더 내 항목들을 균등 배치
                                        borderBottom: '1px solid #ddd', // 헤더 밑에 border 추가
                                    },
                                    '& .MuiDataGrid-cell': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: 12, // 셀 글자 크기
                                        borderRight: '1px solid #ccc',
                                    },
                                    '& .MuiDataGrid-cell-last': {
                                        borderRight: 'none',
                                    },
                                    '& .MuiDataGrid-row': {
                                        // 행 스타일
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#c5c5c5', // 마우스 오버 시 배경색
                                    },
                                }}
                            />
                            <div className="addMember-box">
                                <AddMember addMember={addMember} />
                            </div>
                        </div>
                            
                            
                        )}
                </div>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message="회원이 삭제되었습니다."
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                />
            </div>
        </React.Fragment>
    );
}

export default Memberlist;
