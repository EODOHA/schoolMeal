import { useState, useEffect, useRef } from 'react';
import { SERVER_URL } from './Constants';
import { useAuth } from './component/sign/AuthContext';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [chatRoomTitle, setChatRoomTitle] = useState('');
    const [participantId, setParticipantId] = useState(''); // 대상 지정.
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isChatRoomsVisible, setIsChatRoomsVisible] = useState(false);

    // @로 참여자 ID 목록 가져오기.
    const [participantList, setParticipantList] = useState([]);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const messagesContainerRef = useRef(null);

    const [isSending, setIsSending] = useState(false);

    const { token, memberId } = useAuth();

    // let eventSource = null;

    const [eventSource, setEventSource] = useState(null); // SSE 연결 상태
    // const [isSseConnected, setIsSseConnected] = useState(true);

    const createHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': token
    });

    // 참여자 목록 가져오기 -------------------------------------------------------------
    useEffect(() => {
        fetch(SERVER_URL + 'members', {
            headers: createHeaders()
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("서버로부터 받은 사용자 데이터:", data); // 디버깅 로그
                // _embedded.members에서 memberId만 추출
                const participantIds = data._embedded?.members.map((member) => member.memberId) || [];
                setParticipantList(participantIds);  // memberId 배열로 상태 업데이트
            })
            .catch((error) => console.error("참여자 목록 가져오기 실패:", error));
    }, []);

    // @ 입력 감지 및 자동완성 목록 표시
    const handleParticipantInputChange = (e) => {
        const input = e.target.value;
        setParticipantId(input);

        const atIndex = input.lastIndexOf("@");
        if (atIndex >= 0) {
            const search = input.substring(atIndex + 1); // '@' 이후 텍스트
            console.log("현재 participantList:", participantList); // 디버깅용 로그

            if (Array.isArray(participantList)) {
                const filtered = participantList.filter((user) =>
                    user.toLowerCase().startsWith(search.toLowerCase())
                );
                setFilteredParticipants(filtered);
                setShowAutocomplete(filtered.length > 0);
            } else {
                console.error("participantList가 배열이 아닙니다:", participantList);
                setShowAutocomplete(false); // 목록 숨김
            }
        } else {
            setShowAutocomplete(false);
        }
    };

    // 자동완성 UI 추가.
    const handleAutocompleteSelect = (selectedMember) => {
        const atIndex = participantId.lastIndexOf("@");
        const updatedInput = participantId.substring(0, atIndex + 1) + selectedMember;
        setParticipantId(updatedInput);
        setShowAutocomplete(false);
    }

    // 서버로부터 메시지를 실시간으로 받는 함수 ---------------------------------------------
    let eventSourceInstance = null; // EventSource 객체를 전역에서 관리

    const connectToSse = () => {
        if (!chatRoomId) return; // 채팅방 ID가 없으면 연결하지 않음

        if (eventSourceInstance && eventSourceInstance.readyState !== EventSource.CLOSED) {
            // 연결이 이미 되어있고, 연결 상태가 CLOSED가 아니라면 재연결 하지 않음
            return;
        }

        const newEventSource = new EventSource(`${SERVER_URL}chat/stream/${chatRoomId}`, {
            headers: {
                Authorization: token,
            }
        });

        // eventSource가 정상적으로 생성된 경우에만 onmessage 설정
        if (newEventSource) {
            newEventSource.onmessage = function (event) {
                const newMessage = JSON.parse(event.data);  // 서버에서 보낸 메시지
                // 중복 메시지 필터링
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.id === newMessage.id)) {
                        return prevMessages; // 이미 있는 메시지는 추가하지 않음
                    }
                    return [...prevMessages, newMessage];
                });
            };

            // 연결이 끊어졌을 때 (EventSource.CLOSED 상태 감지)
            newEventSource.onerror = function () {
                if (newEventSource.readyState === EventSource.CLOSED) {
                    console.log('SSE connection closed. Attempting to reconnect...');
                    // 3초 후 재연결 시도
                    setTimeout(connectToSse, 3000);
                }
            };

            // 새로운 EventSource 객체 저장
            eventSourceInstance = newEventSource;
        };
    };

    // useEffect(() => {
    //     const eventSource = new EventSource(`${SERVER_URL}chat/stream/${chatRoomId}`, {
    //         headers: {
    //             Authorization: token,
    //         }
    //     });

    //     eventSource.onmessage = (event) => {
    //         const newMessage = JSON.parse(event.data);
    //         setMessages((prevMessages) => [...prevMessages, newMessage]);
    //     };

    //     eventSource.onerror = () => {
    //         console.error("SSE connection error.");
    //         eventSource.close();
    //     };

    //     return () => {
    //         eventSource.close();
    //     };
    // }, [chatRoomId]);

    // useEffect(() => {
    //     if (!isSseConnected) {
    //         const interval = setInterval(() => {
    //             fetch(SERVER_URL + `chat/${chatRoomId}/messages`)
    //                 .then((response) => response.json())
    //                 .then((data) => setMessages(data))
    //                 .catch((error) => console.error('Polling failed:', error));
    //         }, 1000);

    //         return () => clearInterval(interval);
    //     }
    // }, [isSseConnected]);

    // 선택된 채팅방의 메시지를 가져오는 함수.
    const fetchMessages = async (roomId) => {
        if (!roomId) return;

        try {
            const response = await fetch(`${SERVER_URL}chat/${roomId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data); // 선택된 채팅방의 메시지로 상태 업데이트.
            } else {
                console.error("채팅방 메시지 불러오기 실패");
            }
        } catch (error) {
            console.error("채팅방 메시지 조회 중 오류 발생", error);
        }
    }

    // 채팅방 선택 시, 해당 채팅방의 메시지 불러오기.
    const handleChatRoomSelect = (roomId) => {
        setChatRoomId(roomId);

        // 선택된 채팅방의 제목 가져오기
        const selectedRoom = chatRooms.find((room) => room.id === roomId);
        setChatRoomTitle(selectedRoom?.title || '채팅방 제목 없음');

        fetchMessages(roomId); // 선택된 채팅방의 메시지 가져오기.
    };

    // 메시지 전송 함수 (API 호출)
    const sendMessage = async () => {
        if (newMessage && chatRoomId && !isSending) {
            setIsSending(true); // 전송 중 상태로 설정.

            // 현재 시간을 timestamp로 설정 (서버에서 처리하기에 맞춰서)
            const timestamp = new Date().toISOString();

            try {
                // 메시지 전송 API 호출
                const response = await fetch(`${SERVER_URL}chat/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        chatRoomId: chatRoomId,
                        sender: memberId,
                        content: newMessage,
                        timestamp: timestamp,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();

                    /// 메시지 중복 추가 방지: 이전 메시지와 동일한 메시지가 추가되지 않도록 체크
                    setMessages((prevMessages) => {
                        const isDuplicate = prevMessages.some(msg => msg.timestamp === result.timestamp);
                        if (!isDuplicate) {
                            return [...prevMessages, result]; // 메시지가 중복되지 않으면 추가
                        }
                        return prevMessages; // 중복되면 기존 메시지 그대로 유지
                    });

                    setNewMessage(''); // 입력란 비우기
                } else {
                    console.error('Message sending failed');
                }
            } catch (error) {
                console.error("Message sending failed");
            } finally {
                setIsSending(false); // 전송 완료 후 상태 초기화.
            }
        }
    };

    // 새 채팅방 생성 함수
    const createNewChatRoom = async () => {
        let participantName = participantId;

        // @가 있는지 확인하고, 있을 때만 split
        if (participantId.includes('@')) {
            participantName = participantId.split("@")[1];
        }

        if (!chatRoomTitle) {
            alert('채팅방 제목을 입력해 주세요!');
            return;
        }

        if (!participantId) {
            alert("채팅에 참여할 사용자의 ID를 입력해 주세요!");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}chat/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    title: chatRoomTitle,
                    memberId: memberId,
                    participantId: participantName, // 대상 ID
                }),
                mode: 'cors',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                if (response.status === 404 && errorMessage === "존재하지 않는 회원입니다!") {
                    alert("존재하지 않는 회원입니다!");
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }

            const result = await response.json();
            const newChatRoomId = result.id;  // 서버에서 반환된 ID로 변경
            setChatRoomId(newChatRoomId);

            // 새 채팅방이 생성되면 채팅방 목록을 갱신.
            chatRoomsList();

            setChatRoomTitle('');
            setParticipantId('');
            setIsDialogVisible(false);

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    content: "채팅방이 생성되었습니다.",
                    sender: "SYSTEM",
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('오류 발생:', error);
            alert('채팅방 생성에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 채팅방 목록 조회.
    const chatRoomsList = async () => {
        try {
            const response = await fetch(`${SERVER_URL}chat/rooms?memberId=${memberId}`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("채팅방 목록:", data); // 서버 응답 확인
                setChatRooms(data);
            } else {
                console.error("채팅방 목록을 불러오는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("채팅방 목록 조회 중 오류가 발생했습니다.", error);
        }
    }

    // 채팅방 삭제 함수
    const deleteChatRoom = async (roomId) => {
        const confirmDelete = window.confirm("정말로 이 채팅방을 삭제하시겠습니까?");
        if (confirmDelete) {
            try {
                const response = await fetch(`${SERVER_URL}chat/rooms/${roomId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token,
                    },
                });

                if (response.ok) {
                    // 채팅방 삭제 후, "채팅방이 삭제되었습니다." 메시지를 채팅창에 추가
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { content: "채팅방이 삭제되었습니다.", sender: "SYSTEM", timestamp: new Date().toISOString() }
                    ]);

                    alert("채팅방이 삭제되었습니다.");
                    // 채팅방 삭제 후, 목록을 다시 불러옵니다.
                    chatRoomsList();
                } else {
                    console.error("채팅방 삭제 실패");
                }
            } catch (error) {
                console.error("채팅방 삭제 중 오류 발생", error);
            }
        }
    };

    // 채팅방 목록 조회.
    useEffect(() => {
        chatRoomsList();
    }, [memberId]);

    // 컴포넌트가 마운트되었을 때 SSE 연결
    useEffect(() => {
        if (chatRoomId) {
            connectToSse();  // chatRoomId가 있을 때만 SSE 연결
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [chatRoomId]);  // chatRoomId가 변경될 때마다 SSE 연결

    // 로그아웃 시(토큰 없을 시), 채팅 내용 초기화.
    useEffect(() => {
        if (!token) {
            setMessages([]);
            setChatRoomId(null);
            setChatRooms([]);
        }
    }, [token]);

    // 채팅 메시지가 추가되면, 스크롤을 하단으로 이동.
    useEffect(() => {
        if (messagesContainerRef.current) {
            // 최하단으로 스크롤 이동.
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // 채팅방 목록 토글 기능 추가.
    const toggleChatRoomsVisibility = () => {
        setIsChatRoomsVisible((prev) => !prev);
    };

    // Dialog 열릴 때마다 상태 초기화
    const handleDialogOpen = () => {
        setChatRoomTitle(""); // 제목 초기화
        setParticipantId(""); // 참여자 ID 초기화
        setMessages([]);
        setIsDialogVisible(true); // Dialog 열기
    };

    // 채팅 전송 엔터키 감지 함수.
    const handleKeyDown = (e) => {
        // 엔터가 눌렸을 때.
        if (e.key === "Enter" && newMessage.trim() && !isSending) {
            e.preventDefault(); // 기본 동작(줄 바꿈)을 방지.
            sendMessage();
        }
    };

    return (
        <div>
            <h1>실시간 채팅</h1>
            <div style={{ width: '400px', margin: '0 auto', border: '1px solid #ccc', padding: '10px', borderRadius: '10px' }}>
                <div>
                    {/* '새 채팅방 만들기' 버튼 */}
                    <Button
                        variant="contained"
                        color={isDialogVisible ? "error" : "success"}
                        onClick={handleDialogOpen}
                        fullWidth
                        style={{ marginBottom: "10px" }}
                    >
                        새 채팅방 만들기
                    </Button>

                    {/* Dialog */}
                    <Dialog
                        open={isDialogVisible}
                        onClose={() => setIsDialogVisible(false)}
                        sx={{
                            "& .MuiDialog-paper": {
                                height: "350px",
                                alignItems: "center",
                                justifyContent: "center",
                            }
                        }}
                    >
                        <DialogTitle>새 채팅방 만들기</DialogTitle>
                        <DialogContent>
                            {/* 채팅방 제목 입력 */}
                            <TextField
                                label="채팅방 제목"
                                fullWidth
                                margin="dense"
                                value={chatRoomTitle}
                                onChange={(e) => setChatRoomTitle(e.target.value)}
                            />
                            {/* 채팅에 참여할 대상 사용자의 ID 입력 */}
                            <TextField
                                label="참여할 사용자 ID / @ 입력 시 멘션 기능!"
                                fullWidth
                                margin="dense"
                                value={participantId}
                                onChange={handleParticipantInputChange}
                            />
                            {/* 자동완성 목록 */}
                            {showAutocomplete && (
                                <div style={{
                                    position: "absolute",
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    maxHeight: "100px",
                                    overflowY: "auto",
                                    zIndex: 1000,
                                }}>
                                    {filteredParticipants.map((user, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAutocompleteSelect(user)}
                                            style={{
                                                padding: "10px",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #eee",
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                                            onMouseOut={(e) => e.target.style.backgroundColor = "white"}
                                        >
                                            {user}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    setIsDialogVisible(false)
                                    setShowAutocomplete(false);
                                }
                                }
                                color="error"
                            >
                                취소
                            </Button>
                            <Button onClick={createNewChatRoom} color="success" variant="contained">
                                생성
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

                {/* 채팅방 목록 토글 버튼 */}
                <Button
                    onClick={toggleChatRoomsVisibility}
                    style={{
                        marginBottom: '10px',
                        padding: '10px',
                        width: '100%',
                        borderRadius: '5px',
                        backgroundColor: '#2196F3',
                        color: 'white'
                    }}
                >
                    {isChatRoomsVisible ? "채팅방 목록" : "채팅방 목록"}
                </Button>

                {/* 채팅방 목록 출력 */}
                {isChatRoomsVisible && (
                    <div>
                        {chatRooms.length === 0 ? (
                            <p>현재 채팅방이 없습니다.</p>
                        ) : (
                            <ul
                                style={{
                                    padding: 0,  // 기본 패딩 없애기
                                    listStyleType: 'none',  // 기본 리스트 스타일 제거
                                    alignItems: 'center',  // 가로 중앙 정렬
                                }}
                            >
                                {chatRooms.map((room) => (
                                    <li
                                        key={room.id}
                                        style={{
                                            display: 'flex',
                                            marginBottom: '10px',
                                            gap: "20px",
                                        }}
                                    >
                                        <Button
                                            onClick={() => handleChatRoomSelect(room.id)}  // 채팅방 선택
                                            style={{
                                                padding: '10px',
                                                width: '100%',
                                                borderRadius: '5px',
                                                backgroundColor: '#2196F3',
                                                color: 'white',
                                            }}
                                        >
                                            {room.title}
                                        </Button>
                                        <Button
                                            onClick={() => deleteChatRoom(room.id)}
                                            style={{
                                                width: '15%',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px'
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* 채팅방 제목 */}
                {chatRoomId && (
                    <div
                        style={{
                            position: 'sticky', // 스크롤해도 제목은 고정
                            top: 0,
                            backgroundColor: '#f5f5f5', // 제목 배경색
                            zIndex: 1, // 다른 요소 위에 표시
                            padding: '10px',
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            borderBottom: '1px solid #ddd', // 제목 아래 구분선
                        }}
                    >
                        {chatRoomTitle} {/* 선택된 채팅방 제목 표시 */}
                    </div>
                )}

                {/* 메시지 목록 출력 */}
                <div
                    ref={messagesContainerRef}
                    style={{
                        height: '300px',
                        overflowY: 'scroll',
                        marginBottom: '10px',
                        boxSizing: 'border-box',  // padding이 크기를 넘지 않게
                    }}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '5px',
                                borderBottom: '1px solid #eee',
                                textAlign: msg.sender === memberId ? 'right' : (msg.sender === "SYSTEM" ? 'center' : 'left'), // SYSTEM은 가운데 정렬
                                marginBottom: '10px',
                            }}
                        >
                            {/* 보낸 사람이 나일 경우 이름을 출력하지 않음 */}
                            {msg.sender !== memberId && <strong>{msg.sender}</strong>} {/* 받은 메시지일 때만 sender 출력 */}

                            {/* 메시지 내용 출력 */}
                            <div
                                style={{
                                    display: 'inline-block',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    maxWidth: '60%',
                                    wordWrap: 'break-word',
                                    marginTop: '5px',
                                    backgroundColor: msg.sender === memberId
                                        ? '#4CAF50'
                                        : msg.sender === "SYSTEM"
                                            ? '#ffeb3b' // SYSTEM 메시지 배경색 (예: 노란색)
                                            : '#e0e0e0',  // 받은 메시지는 회색
                                    color: msg.sender === memberId ? 'white' : 'black', // 보낸 메시지는 흰색, 받은 메시지는 검정색
                                    textAlign: msg.sender === memberId ? 'left' : 'left', // 메시지 내용은 왼쪽 정렬
                                }}
                            >
                                {msg.content} {/* 말풍선 형태로 메시지 내용 출력 */}
                            </div>

                            {/* 시간 출력 */}
                            <div style={{ fontSize: '0.8em', color: '#888', marginTop: '5px' }}>
                                {msg.timestamp} {/* 시간 표시 */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 채팅방이 선택된 경우에만 input과 전송 버튼 표시 */}
                {chatRoomId && (
                    <div>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown} // 엔터키 감지.
                            placeholder="메시지를 입력하세요"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                boxSizing: 'border-box',  // padding이 크기를 넘지 않게
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{ padding: '10px', marginTop: '5px', width: '100%', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white' }}
                        >
                            전송
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;
