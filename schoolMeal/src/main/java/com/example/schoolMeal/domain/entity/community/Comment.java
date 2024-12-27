package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String author;

    @ManyToOne
    @JoinColumn(name = "notice_id", nullable = true)
    private Notice notice;

    @ManyToOne
    @JoinColumn(name = "regional_community_id", nullable = true)
    private RegionalCommunity regionalCommunity;

    private LocalDateTime createdDate;

    // 기본 생성자
    public Comment() {
        this.createdDate = LocalDateTime.now();
    }

    // 공지사항 댓글 생성자
    public Comment(String content, String author, Notice notice) {
        this.content = content;
        this.author = author;
        this.notice = notice;
        this.createdDate = LocalDateTime.now();
    }

    // 지역별 커뮤니티 댓글 생성자
    public Comment(String content, String author, RegionalCommunity regionalCommunity) {
        this.content = content;
        this.author = author;
        this.regionalCommunity = regionalCommunity;
        this.createdDate = LocalDateTime.now();
    }

    // 가공식품 댓글 생성자
    public Comment(String content, String author, ProcessedFood processedFood) {
        this.content = content;
        this.author = author;
        this.createdDate = LocalDateTime.now();
    }    
}
