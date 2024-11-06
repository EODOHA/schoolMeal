package com.example.schoolMeal.dto.mealInfo;

import java.util.List;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MealExpertDto {

	private long exp_id;
	
	@NotBlank(message="이름은 필수 항목입니다.")
	private String exp_name;	//이름
	
	@NotBlank(message="소속은 필수 항목입니다.")
	private String exp_department;	//소속
	
	@NotBlank(message="직책은 필수 항목입니다.")
	private String exp_position;	//직책
	
	@Email(message="올바른 이메일 형식을 입력해 주세요.")
	private String exp_email;	//이메일

	// 일대다 연관관계이므로 리스트형식으로 선언
	private List<ExpertHistory> histories;	//경력사항
	private List<ExpertQualification> qualifications;	//보유 자격증

}
