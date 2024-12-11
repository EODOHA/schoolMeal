package com.example.schoolMeal.domain.entity.mealInfo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ExpertProfileImage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	private String url;

	private String mimeType;

	@Lob
	@Column(nullable = true)
	private byte[] data;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exp_id")
    private MealExpert mealExpert;  // 전문가와의 연관 관계 설정

}
