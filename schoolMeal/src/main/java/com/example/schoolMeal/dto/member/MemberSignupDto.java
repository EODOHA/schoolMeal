package com.example.schoolMeal.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberSignupDto {
	
	@NotBlank(message="회원명은 필수입니다.")
	private String memberName;
	
	@NotBlank(message="회원 아이디는 필수입니다.")
	private String memberId;
	
	@NotBlank(message="비밀번호는 필수입니다.")
	@Size(min=8, max=20, message="비밀번호는 8자 이상, 20자 이하여야 합니다.")
	private String password;
	
	@NotBlank(message="비밀번호 확인은 필수입니다.")
	private String confirmPassword;
	
	@NotBlank(message="이메일은 필수입니다.")
	@Email(message="유효하지 않은 이메일 형식입니다.")
	private String email;
	
	@NotBlank(message="전화번호는 필수입니다.")
	private String phone;
	
	private String authMethod;
	
	private String kakaoAccessToken;

}
