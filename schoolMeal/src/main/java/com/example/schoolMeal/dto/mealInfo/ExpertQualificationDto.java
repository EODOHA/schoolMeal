package com.example.schoolMeal.dto.mealInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExpertQualificationDto {
	
	private Long exp_qual_id;
	private String exp_qual_description;	//보유 자격증

}
