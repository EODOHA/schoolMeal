package com.example.schoolMeal.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequestDto {

	private String email;
	private String newPassword;
}
