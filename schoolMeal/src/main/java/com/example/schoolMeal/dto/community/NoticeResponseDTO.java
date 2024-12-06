package com.example.schoolMeal.dto.community;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

// 공지사항 응답 데이터를 클라이언트에게 전달하기 위한 DTO 클래스
@Getter
@Setter
public class NoticeResponseDTO {
    private Long id;                // 공지사항 ID (고유 식별자)
    private String title;           // 제목
    private String content;         // 내용
    private String author;          // 작성자 이름
    private int viewCount;          // 조회수
    private LocalDateTime createdDate;      //공지사항 생성 시간
    private LocalDateTime updatedDate;      // 수정 시간

    // 파일 정보 필드 추가
    private Long fileId;           // 파일의 고유 ID
    private String origFileName;   // 첨부된 원본 파일 이름

    // 생성자 NoticeResponseDTO 생성 시 필드 초기화
    public NoticeResponseDTO(Long id, String title, String content, String author, int viewCount,
                             LocalDateTime createdDate, LocalDateTime updatedDate,
                             Long fileId, String origFileName) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.viewCount = viewCount;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.fileId = fileId;
        this.origFileName = origFileName;
    }
}
