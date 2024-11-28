package com.example.schoolMeal.dto.communityInfo;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

// 공지사항 응답 데이터를 클라이언트에게 전달하기 위한 DTO 클래스
@Getter
@Setter
public class NoticeResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private int viewCount;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // 파라미터를 받는 생성자
    public NoticeResponseDTO(Long id, String title, String content, String author, int viewCount, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.viewCount = viewCount;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}