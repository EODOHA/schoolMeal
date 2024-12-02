package com.example.schoolMeal.dto.loginResponse;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDto {
	private boolean success;
	private String token;
	private String error;
	private String role;
	
}
