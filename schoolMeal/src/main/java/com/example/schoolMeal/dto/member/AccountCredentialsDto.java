package com.example.schoolMeal.dto.member;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountCredentialsDto {

	@NotBlank(message="회원 아이디를 입력해 주세요.")
	private String memberId;
	
	@NotBlank(message="비밀번호를 입력해 주세요.")
	private String password;
	
}
