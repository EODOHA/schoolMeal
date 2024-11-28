package com.example.schoolMeal.dto.communityInfo;

// 클라이언트로부터 공지사항 요청을 받을 때 사용하는 DTO 클래스
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeRequestDTO {
    private String title;
    private String content;
    private String author;

    // 기본 생성자
    public NoticeRequestDTO() {}

    // 파라미터를 받는 생성자
    public NoticeRequestDTO(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}