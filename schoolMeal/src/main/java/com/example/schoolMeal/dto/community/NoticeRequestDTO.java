package com.example.schoolMeal.dto.community;

// 클라이언트로부터 공지사항 요청을 받을 때 사용하는 DTO 클래스
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeRequestDTO {
    private String title;       //공지사항 제목
    private String content;     // 내용
    private String author;      // 작성자이름

    // 기본 생성자 , 프레임워크에서 객체 생성 시 사용
    public NoticeRequestDTO() {}

    // 파라미터를 받는 생성자 , DTO를 생성할 때 필드 초기화
    public NoticeRequestDTO(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}