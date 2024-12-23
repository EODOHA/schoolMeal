package com.example.schoolMeal.domain.entity.ingredientInfo;

import com.example.schoolMeal.common.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Table(name = "ingredientPrice")
@Entity
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientPrice extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String category; // 카테고리(농/수/축/가공)
	private String productName; // 품목명
	private String grade; // 등급
	private String productDistrict; // 생산지
	private int productPrice; // 가격

}
