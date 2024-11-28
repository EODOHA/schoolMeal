package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notice") // 테이블명 notice
@Getter
@Setter
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // 고유 식별자 필드, 자동 증가되는 기본 키
    private Long id;

    // 공지사항의 제목
    private String title;

    // 공지사항의 내용
    @Column(columnDefinition = "TEXT")
    private String content;

    // 공지사항의 조회수
    private int viewCount;

    // 공지사항 작성자의 이름
    private String author;

    // 공지사항이 생성된 날짜 및 시간
    private LocalDateTime createdDate;

    // 공지사항이 수정된 날짜 및 시간 (수정 시 갱신)
    private LocalDateTime updatedDate;

    // 해당 공지사항에 달린 모든 댓글을 나타내는 필드 (일대다 관계)
    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // 기본 생성자
    // 기본 생성자 (생성 시 조회수를 0으로 초기화하고 생성 날짜를 현재로 설정)
    public Notice() {
        this.createdDate = LocalDateTime.now();
        this.viewCount = 0;
    }

    // 파라미터를 받는 생성자
    // 공지사항 생성 시 필요한 데이터를 설정하는 생성자
    public Notice(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdDate = LocalDateTime.now();
        this.viewCount = 0;
    }
}