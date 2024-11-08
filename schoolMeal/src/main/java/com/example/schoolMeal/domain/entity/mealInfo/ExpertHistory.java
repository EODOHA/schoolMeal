package com.example.schoolMeal.domain.entity.mealInfo;

import com.example.schoolMeal.common.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
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

@Table(name = "expertHistory")  //전문인력 이력사항 테이블
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpertHistory extends BaseEntity {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable=false, updatable=false)
	private Long exp_hist_id;
	
	private String exp_hist_history;	//이력사항
	
	
	@ManyToOne	//전문인력과 N:1 연관관계 -> 한 명의 인력은 여러 개의 이력사항을 가질 수 있다.
	@JoinColumn(name="exp_id", nullable=false) // exp_id를 외래키로 가짐
	@JsonBackReference	//@ManyToOne에서 주로 사용, 자식 객체에서 부모 객체를 직렬화할 때, 부모 객체가 직렬화되지 않도록 지정
	private MealExpert mealExpert;	// 전문인력
	
	public ExpertHistory(String exp_hist_history, MealExpert mealExpert) {
		this.exp_hist_history = exp_hist_history;
		this.mealExpert = mealExpert;
	}
}
