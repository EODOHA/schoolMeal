package com.example.schoolMeal.domain.repository.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.chat.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
	List<Message> findByChatRoomId(Long chatRoomId);

}
