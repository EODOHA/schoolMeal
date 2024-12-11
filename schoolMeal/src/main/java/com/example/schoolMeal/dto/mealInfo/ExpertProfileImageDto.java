package com.example.schoolMeal.dto.mealInfo;

import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ExpertProfileImageDto {
	private Long id;
	private String url;
	private String name;
	private String mimeType;
	private MealExpert mealExpert;

	public ExpertProfileImageDto(Long id, String url, String name, String mimeType, Long exp_id) {
		this.id = id;
		this.url = url;
		this.name = name;
		this.mimeType = mimeType;
		exp_id = mealExpert.getExp_id();
	}

	public ExpertProfileImageDto(Long id, String url, String name, String mimeType) {
		this.id = id;
		this.url = url;
		this.name = name;
		this.mimeType = mimeType;
	}
}
