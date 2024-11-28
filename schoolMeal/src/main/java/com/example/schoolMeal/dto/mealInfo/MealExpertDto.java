package com.example.schoolMeal.dto.mealInfo;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//@Builder
public class MealExpertDto {
	private Long exp_id;

	@NotBlank(message = "이름은 필수 항목입니다.")
	private String exp_name; // 이름

	@NotBlank(message = "소속은 필수 항목입니다.")
	private String exp_department; // 소속

	@NotBlank(message = "직책은 필수 항목입니다.")
	private String exp_position; // 직책

	@Email(message = "올바른 이메일 형식을 입력해 주세요.")
	private String exp_email; // 이메일
	
	private String exp_author;

//	private String exp_profileImg; // 프로필이미지

	// 일대다 연관관계이므로 리스트형식으로 선언
	private List<ExpertHistoryDto> histories; // 경력사항
	private List<ExpertQualificationDto> qualifications; // 보유 자격증

}
