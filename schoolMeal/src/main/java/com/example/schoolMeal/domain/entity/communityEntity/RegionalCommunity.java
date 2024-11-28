package com.example.schoolMeal.domain.entity.communityEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "regional_community") // 테이블 이름 지정
@Getter
@Setter
public class RegionalCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // 고유 식별자 필드, 자동 증가되는 기본 키
    private Long id;

    // 게시글의 제목을 나타내는 필드
    private String title;

    // 게시글의 내용을 나타내는 필드 (긴 텍스트 지원)
    @Column(columnDefinition = "TEXT")
    private String content;

    // 게시글 작성자의 이름을 나타내는 필드
    private String author;

    // 게시글이 생성된 날짜 및 시간을 나타내는 필드
    private LocalDateTime createdDate;

    // 게시글이 수정된 날짜 및 시간을 나타내는 필드 (수정 시 갱신됨)
    private LocalDateTime updatedDate;

    // 해당 게시글에 달린 모든 댓글을 나타내는 필드 (일대다 관계)
    @OneToMany(mappedBy = "regionalCommunity", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    // 기본 생성자
    public RegionalCommunity() {
        this.createdDate = LocalDateTime.now();
    }

    // 파라미터를 받는 생성자
    public RegionalCommunity(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdDate = LocalDateTime.now();
    }
}
