package com.example.schoolMeal.domain.entity.chat;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String sender;
	private String content;
	private String timestamp;
	
	@ManyToOne
	@JoinColumn(name = "chat_room_id")
	@JsonBackReference // 순환 참조 방지 위함.
	private ChatRoom chatRoom;

}
