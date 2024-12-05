package com.example.schoolMeal.dto.community;

import lombok.Getter;
import lombok.Setter;
import com.example.schoolMeal.domain.entity.community.RegionCategory;  // 새로 추가

import java.time.LocalDateTime;

@Getter
@Setter
public class RegionalCommunityResponseDTO {
    private Long id;  // 게시글 ID
    private String title;  // 게시글 제목
    private String content;  // 게시글 내용
    private String author;  // 작성자 이름
    private LocalDateTime createdDate;  // 생성 날짜
    private LocalDateTime updatedDate;  // 수정 날짜
    private RegionCategory region;  // 지역 카테고리 (추가된 필드)

    // 기본 생성자
    public RegionalCommunityResponseDTO() {}

    // 파라미터를 받는 생성자
    public RegionalCommunityResponseDTO(Long id, String title, String content, String author, LocalDateTime createdDate, LocalDateTime updatedDate, RegionCategory region) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.region = region;
    }
}
