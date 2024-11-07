package com.example.schoolMeal.domain.entity.mealInfo;

import com.example.schoolMeal.common.entity.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name="expertQuailfication")  // 전문인력 자격사항 테이블
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpertQualification extends BaseEntity {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable=false, updatable=false)
	private Long exp_qual_id;
	
	private String exp_qual_qualification;	// 자격사항
	

	@ManyToOne	//전문인력과 N:1 연관관계 -> 한 명의 전문인력은 여러 개의 자격사항을 가질 수 있다.
	@JsonIgnore
	@JoinColumn(name="exp_id", nullable=false) // exp_id를 외래키로 가짐
	private MealExpert mealExpert;	// 전문인력
	
	public ExpertQualification(String exp_qual_qualification, MealExpert mealExpert) {
		this.exp_qual_qualification = exp_qual_qualification;
		this.mealExpert = mealExpert;
	}
	
}
