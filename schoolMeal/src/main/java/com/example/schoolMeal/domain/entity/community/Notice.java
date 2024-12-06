package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notice")
@Getter
@Setter
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 기본 키 자동생성
    private Long id;

    private String title;   // 공지사항 제목

    @Column(columnDefinition = "TEXT")  //긴 내용을 고려해서 TEXT 타입으로 설정
    private String content;             // 공지사항 본문 내용

    private int viewCount;              // 조회수

    private String author;              // 작성자 이름

    private LocalDateTime createdDate;  // 생성일

    private LocalDateTime updatedDate;  // 수정일

    // 파일 정보와의 연관 관계 설정 - NOTICE는 하나의 파일을 가질 수 있음(첨부파일 한개)
    @OneToOne(cascade = CascadeType.ALL) // NOTICE삭제하면 파일도 같이 삭제
    @JoinColumn(name = "file_id")        // 연관된 파일의ID와 매핑하기
    private CommunityFile file;

    // NOTICE와 COMMENT 일대다 관계 - 하나의 공지사항에는 여러개의 댓글이 가능
    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();


    // 기본 생성자  - 공지사항이 생성된 시간을 현재 시간으로 초기화 + 조회수 0
    public Notice() {
        this.createdDate = LocalDateTime.now();
        this.viewCount = 0;
    }

    // 매개변수가 있는 생성자 : 제목 , 내용 , 작성자를 초기화하고 생성시간과 조회수도 설정 필수정보의 의미
    public Notice(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdDate = LocalDateTime.now();
        this.viewCount = 0;
    }
}
