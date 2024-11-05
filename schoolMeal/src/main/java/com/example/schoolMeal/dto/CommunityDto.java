package com.example.schoolMeal.dto;

import com.example.schoolMeal.domain.entity.Community;
import jakarta.validation.constraints.Size;
import lombok.*;

import jakarta.validation.constraints.*;



import java.time.LocalDateTime;


@Getter
@Setter
public class CommunityDto {

    private Long id;

    @NotBlank(message = "제목을 적어주세요")
    @Size(max = 100, message = "제목은 최대 100자까지 입력 가능합니다.")
    private String title;

    @Size(max = 2000, message = "내용은 최대 2000자까지 입력 가능합니다.")
    private String content;

    private int viewCount;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Community 엔티티를 CommunityDto로 변환하는 생성자
    public CommunityDto(Community community) {
        this.id = community.getId();
        this.title = community.getTitle();
        this.content = community.getContent();
        this.viewCount = community.getViewCount();
        this.author = community.getAuthor();
        this.createdAt = community.getCreatedAt();
        this.updatedAt = community.getUpdatedAt();
    }

    // DTO에서 엔티티로 변환하는 메서드 (toEntity 메서드)
    public Community toEntity() {
        return Community.builder()
                .id(this.id)
                .title(this.title)
                .content(this.content)
                .viewCount(this.viewCount)
                .author(this.author)
                // createdAt와updateAt는 jpa가 자동으로 해준다해서 뺏습니다
                .build();
    }
}
