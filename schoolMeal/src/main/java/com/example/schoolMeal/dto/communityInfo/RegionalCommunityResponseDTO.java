package com.example.schoolMeal.dto.communityInfo;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class RegionalCommunityResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // 기본 생성자
    public RegionalCommunityResponseDTO() {}

    // 파라미터를 받는 생성자
    public RegionalCommunityResponseDTO(Long id, String title, String content, String author, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}
