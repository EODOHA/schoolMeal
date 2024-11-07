package com.example.schoolMeal.domain.entity.mealResource;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "`Menu_Recipe`") // 테이블 명
@Entity
@Getter @Setter
@NoArgsConstructor
public class MenuRecipe {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)  // 번호가 차례대로 늘어나도록
	@Column(nullable = false, updatable = false)
	private Integer id;
	
	// 내용 필드, 최대 500자
	@Column(length = 500)
	private String content;
	
	// 제목 필드
	@Column(nullable = false, unique = true)
	private String title;
	
	// 작성자 필드
	@Column(nullable = false, unique = true)
	private String writer;
	
	// 생성 날짜와 시간을 저장하는 필드
	@Column(nullable = false)
	private LocalDateTime createdDate = LocalDateTime.now();  // 기본값을 현재 시간으로 설정
	
}
