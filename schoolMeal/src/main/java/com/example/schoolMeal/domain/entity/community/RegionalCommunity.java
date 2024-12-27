package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "regional_community") // 테이블 이름 지정
@Getter
@Setter
public class RegionalCommunity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // 고유 식별자 필드

	private String title; // 게시글 제목

	@Column(columnDefinition = "TEXT")
	private String content; // 게시글 내용 (긴 텍스트 지원)

	private String author; // 게시글 작성자 이름

	private LocalDateTime createdDate; // 게시글 생성 날짜 및 시간

	private LocalDateTime updatedDate; // 게시글 수정 날짜 및 시간

	private int viewCount; // 조회수 필드 추가

	@OneToMany(mappedBy = "regionalCommunity", cascade = CascadeType.ALL)
	private List<Comment> comments = new ArrayList<>(); // 게시글에 달린 모든 댓글

	@Enumerated(EnumType.STRING)
	private RegionCategory region; // 게시글 지역 카테고리 (추가된 필드)

	// 기본 생성자
	public RegionalCommunity() {
		this.createdDate = LocalDateTime.now(); // 생성 시점 기록
		this.viewCount = 0; // 초기 조회수는 0
	}

	// 파라미터를 받는 생성자 (지역 필드를 추가)
	public RegionalCommunity(String title, String content, String author, RegionCategory region) {
		this.title = title;
		this.content = content;
		this.author = author;
		this.region = region;
		this.createdDate = LocalDateTime.now(); // 생성 시점 기록
		this.viewCount = 0; // 초기 조회수는 0
	}

	// 조회수 증가 메서드
	public void incrementViewCount() {
		this.viewCount++;
	}
}
