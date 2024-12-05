package com.example.schoolMeal.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerificationRequestDto {

	private String email;
	private String token;
}
