package com.example.schoolMeal.dto;

import com.example.schoolMeal.domain.entity.Community;
import jakarta.validation.constraints.Size;
import lombok.*;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
public class CommunityDto { // asdf

    private Long id;

    @NotBlank(message = "제목을 적어주세요")
    @Size(max = 100, message = "제목은 최대 100자까지 입력 가능합니다.")
    private String title;       //제목

    @Size(max = 2000, message = "내용은 최대 2000자까지 입력 가능합니다.")
    private String content;     //게시글내용

    private int viewCount;      //조회수
    private String author;      //사용자
    private LocalDateTime createdAt;    //생성일
    private LocalDateTime updatedAt;    //수정일

    private String categoryName; // 카테고리 이름

    // Community 엔티티를 CommunityDto로 변환하는 생성자
    public CommunityDto(Community community) {
        this.id = community.getId();
        this.title = community.getTitle();
        this.content = community.getContent();
        this.viewCount = community.getViewCount();
        this.author = community.getAuthor();
        this.createdAt = community.getCreatedAt();
        this.updatedAt = community.getUpdatedAt();
        this.categoryName = community.getCategoryName(); // 카테고리 정보 추가
    }

    // DTO에서 엔티티로 변환하는 메서드... 사용안해도 되지만 사용하면 유지보수하기 용이하다고 합니다
    public Community toEntity() {
        return Community.builder()
                .id(this.id)
                .title(this.title)
                .content(this.content)
                .viewCount(this.viewCount)
                .author(this.author)
                .categoryName(this.categoryName)
                .build();
    }
}
