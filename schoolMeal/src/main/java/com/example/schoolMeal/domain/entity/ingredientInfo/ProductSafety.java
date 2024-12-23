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

@Table(name = "productSafety")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSafety extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String category;	//카테고리(농/축/수/가공)
	private String productName;		//품목
	private String producer;		//생산자
	private String safetyResult;	//분석 결과
	private String inspector;	//조사기관
	private String inspectMaterial;	//조사물질
	private String productDistrict;		// 생산지

}
