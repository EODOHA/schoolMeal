package com.example.schoolMeal.domain.entity.mealResource;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import com.example.schoolMeal.domain.entity.FileUrl;  // FileUrl import 추가
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "`meal_policy`") // 테이블 명
@Entity
@Getter @Setter
@NoArgsConstructor
public class MealPolicy {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	
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
	
	// 첨부파일 외래키
	@Column(name = "file_id")  // 컬럼 이름을 file_id로 지정
	private Long fileId;

	// 파일 정보와의 1:1 관계 (MealPolicy와 FileUrl)
	@OneToOne
	@JoinColumn(name = "file_id", referencedColumnName = "id", insertable = false, updatable = false)
	private FileUrl fileUrl;

}
