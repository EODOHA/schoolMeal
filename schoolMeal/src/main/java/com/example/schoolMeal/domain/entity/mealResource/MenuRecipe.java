package com.example.schoolMeal.domain.entity.mealResource;

import java.time.LocalDateTime;

import com.example.schoolMeal.domain.entity.FileUrl;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "MenuRecipe") // 테이블 명
@Entity
@Getter @Setter
@NoArgsConstructor
public class MenuRecipe {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	
	// 내용 필드, 최대 500자
	@Column(length = 500)
	private String content;
	
	// 제목 필드
	@Column(nullable = false)
	private String title;
	
	// 작성자 필드
	@Column(nullable = false)
	private String writer;
	
	// 연령대 필드 (10대, 20대, 30대, 40대 이상)
	@Column(nullable = false)
	private String ageGroup;
	
	// 시기별 필드 (봄, 여름, 가을, 겨울, 기타(사계절)
	@Column(nullable = false)
	private String season;
	
	// 생성 날짜와 시간을 저장하는 필드
	@Column(nullable = false)
	private LocalDateTime createdDate = LocalDateTime.now();  // 기본값을 현재 시간으로 설정
	
	// 첨부파일 외래키
	@Column(name = "file_id")
	private Long fileId;

	// 파일 정보와의 1:1 관계
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "file_id", referencedColumnName = "id", insertable = false, updatable = false)
	private FileUrl fileUrl;
	
}
