package com.example.schoolMeal.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequestDto {

	private Long chatRoomId;
	private String sender;
	private String content;
}
