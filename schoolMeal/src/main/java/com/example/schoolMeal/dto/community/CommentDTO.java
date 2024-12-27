package com.example.schoolMeal.dto.community;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class CommentDTO {
    private Long id;
    private String content;
    private String author;
    private Long noticeId;
    private Long regionalCommunityId;
    private Long processedFoodId;
    private LocalDateTime createdDate;

    // 기본 생성자
    public CommentDTO() {}

    // 통합된 생성자
    public CommentDTO(Long id, String content, String author, Long noticeId, Long regionalCommunityId, LocalDateTime createdDate) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.noticeId = noticeId;
        this.regionalCommunityId = regionalCommunityId;
        this.createdDate = createdDate;
    }
    
}
