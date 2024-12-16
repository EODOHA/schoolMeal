package com.example.schoolMeal.controller.chat;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.schoolMeal.domain.entity.chat.ChatRoom;
import com.example.schoolMeal.domain.entity.chat.Message;
import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;
import com.example.schoolMeal.dto.chat.MessageRequestDto;
import com.example.schoolMeal.dto.chat.NewChatRequestDto;
import com.example.schoolMeal.service.chat.ChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/chat")
public class ChatController {

	@Autowired
	private ChatService chatService;
	
	@Autowired
	private MemberRepository memberRepository;
	
	// SSE 스트리밍을 위한 메세지를 저장할 리스트.
	private Map<Long, List<SseEmitter>> emittersByChatRoom = new HashMap<>();
	
	// 새로운 메세지를 스트리밍하는 엔드포인트
	@GetMapping(value = "/stream/{chatRoomId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter streamMessages(@PathVariable Long chatRoomId) {
		// SseEmitter 객체 생성.
		SseEmitter emitter = new SseEmitter();
		
		// 해당 채팅방에 연결된 emitters 리스트에 추가.
		emittersByChatRoom
			.computeIfAbsent(chatRoomId, k -> new ArrayList<>())
			.add(emitter);
		
		// 연결 종료 시, emitters 리스트에서 제거.
		emitter.onCompletion(() -> removeEmitter(chatRoomId, emitter));
		emitter.onTimeout(() -> removeEmitter(chatRoomId, emitter));
		
		return emitter;
	}
	
	// 특정 채팅방에서 emitter를 제거하는 메서드.
	private void removeEmitter(Long chatRoomId, SseEmitter emitter) {
		List<SseEmitter> emitters = emittersByChatRoom.get(chatRoomId);
		if (emitters != null) {
			emitters.remove(emitter);
			if (emitters.isEmpty()) {
				emittersByChatRoom.remove(chatRoomId);
			}
		}
	}
	
	// 새로운 메세지를 클라이언트로 전송.
	private void sendToClients(Long chatRoomId, Message message) {
		List<SseEmitter> emitters = emittersByChatRoom.get(chatRoomId);
		if (emitters != null) {
			String messageJson = convertMessageToJson(message);
			for (SseEmitter emitter : emitters) {
				try {
					// 메세지를 클라이언트로 전송.
					emitter.send(message);
				} catch (IOException e) {
					emitter.completeWithError(e);
				}
			}
		}
	}
	
	// Message 객체를 JSON 문자열로 변환하는 메서드.
	private String convertMessageToJson(Message message) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			return objectMapper.writeValueAsString(message);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return "{}";
		}
	}
	
	// 메세지 전송.
	@PostMapping("/sendMessage")
	public ResponseEntity<Message> sendMessage(@RequestBody MessageRequestDto messageRequest) {
		Message savedMessage = chatService.saveMessage(
				messageRequest.getChatRoomId(),
				messageRequest.getSender(),
				messageRequest.getContent()
			);
		// 저장된 메시지를 모든 클라이언트로 전송.
		sendToClients(messageRequest.getChatRoomId(), savedMessage);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
	}
	
	// 새로운 채팅방 생성
	@PostMapping("/new")
	public ResponseEntity<?> createChat(@RequestBody NewChatRequestDto request) {
		// participantId 유효성 체크
	    Optional<Member> member = memberRepository.findByMemberId(request.getParticipantId());
	    if (!member.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                             .body("존재하지 않는 회원입니다!");
	    }
		ChatRoom chatRoom = chatService.createChatRoom(
				request.getTitle(),
				request.getMemberId(),
				request.getParticipantId());
		
		return ResponseEntity.ok(chatRoom);
	}
	
	// 채팅방 목록 조회.
	@GetMapping("/rooms")
	public ResponseEntity<List<ChatRoom>> getMemberChatRooms(@RequestParam String memberId) {
		List<ChatRoom> chatRooms = chatService.getMemberChatRooms(memberId);
		return ResponseEntity.ok(chatRooms);
	}
	
	// 메시지 저장
    @PostMapping("/{chatRoomId}/messages")
    public ResponseEntity<Message> saveMessage(
        @PathVariable Long chatRoomId,
        @RequestBody MessageRequestDto messageRequest
    ) {
        Message savedMessage = chatService.saveMessage(
            chatRoomId,
            messageRequest.getSender(),
            messageRequest.getContent()
        );
        return ResponseEntity.ok(savedMessage);
    }
	
	// 특정 채팅방의 메시지 조회.
	@GetMapping("/{chatRoomId}/messages")
	public ResponseEntity<List<Message>> getMessages(@PathVariable Long chatRoomId) {
		List<Message> messages = chatService.getMessages(chatRoomId);
		return ResponseEntity.ok(messages);
	}
	
	@DeleteMapping("/rooms/{chatRoomId}")
	public ResponseEntity<Void> deleteChatRoom(@PathVariable Long chatRoomId) {
		boolean deleted = chatService.deleteChatRoom(chatRoomId);
		if (deleted) {
			return ResponseEntity.noContent().build(); // 삭제 성공 시 응답.
		} else {
			return ResponseEntity.notFound().build();
		}
	}
		
//	// 특정 회원의 채팅방 목록 조회
//	@GetMapping("/member/{memberId}")
//	public ResponseEntity<List<ChatRoom>> getMemberChatRooms(@PathVariable String memberId) {
//		List<ChatRoom> chatRooms = chatService.getMemberChatRooms(memberId);
//		return ResponseEntity.ok(chatRooms);
//	}
}
