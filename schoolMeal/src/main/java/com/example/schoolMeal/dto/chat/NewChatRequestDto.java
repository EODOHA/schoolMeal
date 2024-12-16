package com.example.schoolMeal.dto.chat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NewChatRequestDto {

	private String title;
	private String memberId;
	private String participantId;
}
