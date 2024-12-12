package com.example.schoolMeal.domain.entity.ingredientInfo;

import java.time.LocalDate;

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

@Table(name = "haccpInfo")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HaccpInfo extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long haccp_id;
	private String haccpDesignationNumber; // HACCP 지정번호
	private String category;	//카테고리(농/수/축/가공)
	private String businessName; // 업소명
	private String address; // 주소
	private String productName; // 품목명
	private String businessStatus; // 영업상태
	private LocalDate certificationEndDate; // 인증종료일자
	
}
