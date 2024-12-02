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

    @ManyToOne
    @JoinColumn(name = "processed_food_id", nullable = true)
    private ProcessedFood processedFood; // 가공식품 정보와의 관계 추가

    @ManyToOne
    @JoinColumn(name = "catering_facility_id", nullable = true)
    private CateringFacility cateringFacility; // 급식시설·가구와의 관계 추가

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
        this.processedFood = processedFood;
        this.createdDate = LocalDateTime.now();
    }

    // 급식시설·가구 댓글 생성자
    public Comment(String content, String author, CateringFacility cateringFacility) {
        this.content = content;
        this.author = author;
        this.cateringFacility = cateringFacility;
        this.createdDate = LocalDateTime.now();
    }
    
}
