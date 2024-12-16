package com.example.schoolMeal.service.chat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.chat.ChatRoom;
import com.example.schoolMeal.domain.entity.chat.Message;
import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.chat.ChatRoomRepository;
import com.example.schoolMeal.domain.repository.chat.MessageRepository;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

@Service
public class ChatService {

	@Autowired
	private ChatRoomRepository chatRoomRepository;
	
	@Autowired
	private MessageRepository messageRepository;
	
	@Autowired
	private MemberRepository memberRepository;
	
	public ChatRoom createChatRoom(String title, String memberId, String participantId) {
		ChatRoom chatRoom = new ChatRoom();
		chatRoom.setTitle(title);
		chatRoom.setMemberId(memberId);  // 생성자의 memberId 설정
		
		// 채팅방에 참가할 사용자 조회.
		Member creator = memberRepository.findByMemberId(memberId).orElseThrow(() -> new RuntimeException("Creator not found"));
		Member participant = memberRepository.findByMemberId(participantId).orElseThrow(() -> new RuntimeException("Participant not found"));

		chatRoom.getMembers().add(creator);
		chatRoom.getMembers().add(participant);
		
		return chatRoomRepository.save(chatRoom);
	}
	
	// 사용자가 속한 채팅방 목록 조회.
	public List<ChatRoom> getMemberChatRooms(String memberId) {
	    // memberId를 이용해 해당 memberId를 가진 회원 조회
	    Member member = memberRepository.findByMemberId(memberId).orElseThrow(() -> new RuntimeException("Member not found"));

	    // memberId와 일치하는 채팅방들만 조회
	    return chatRoomRepository.findAll().stream()
	            .filter(chatRoom -> chatRoom.getMembers().stream()
	                .anyMatch(m -> m.getId().equals(member.getId())))  // memberId로 필터링
	            .collect(Collectors.toList());
	}
	
	// 채팅방에 해당하는 메시지들 조회.
	public List<Message> getMessages(Long chatRoomId) {
		return messageRepository.findByChatRoomId(chatRoomId);
	}
	
	// 메시지 저장.
	public Message saveMessage(Long chatRoomId, String sender, String content) {
		Message message = new Message();
		message.setSender(sender);
		message.setContent(content);
		message.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
		
		ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow();
		message.setChatRoom(chatRoom);
		return messageRepository.save(message);
	}
	
	// 채팅방 삭제.
	public boolean deleteChatRoom(Long chatRoomId) {
		// 채팅방 존재 여부 확인.
		if (chatRoomRepository.existsById(chatRoomId)) {
			chatRoomRepository.deleteById(chatRoomId);
			return true;
		}
		return false;
	}
}
