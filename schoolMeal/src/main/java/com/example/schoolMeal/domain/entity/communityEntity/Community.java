package com.example.schoolMeal.domain.entity.communityEntity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "community")
@EntityListeners(AuditingEntityListener.class)
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;  // 게시물 제목

    @Column(length = 2000)
    private String content = "";  // 기본값 추가

    @Column(nullable = false)
    private int viewCount = 0;  // 조회수 기본값 0

    @Column(nullable = false)
    private String author = "익명";  // 기본값을 "익명"으로 설정

    @Column(nullable = false)
    private String categoryName;  // 카테고리 이름

    private String fileUrl = null;  // 파일 URL 기본값 null
    private String fileName = null; // 파일 이름 기본값 null
    private String imageUrl = null; // 이미지 URL 기본값 null

    @CreatedDate
    @Column(updatable = false)  // 생성일은 수정 불가
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // 가공식품 정보 관련 필드
    private String productName;      // 제품명
    private Integer originalPrice;   // 원가
    private Integer consumerPrice;   // 소비자가
    private String brandName;        // 브랜드명
    private String detailedDescription;  // 상세 소개

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Community_Comment> comments = new ArrayList<>();

    @Builder
    public Community(Long id, String title, String content, int viewCount, String author, String categoryName,
                     String fileUrl, String fileName, String imageUrl, String productName, Integer originalPrice,
                     Integer consumerPrice, String brandName, String detailedDescription) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author != null ? author : "익명";
        this.categoryName = categoryName;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.imageUrl = imageUrl;
        this.productName = productName;
        this.originalPrice = originalPrice;
        this.consumerPrice = consumerPrice;
        this.brandName = brandName;
        this.detailedDescription = detailedDescription;
    }

    @PrePersist
    public void setDefaults() {
        if (this.author == null || this.author.isEmpty()) {
            this.author = "익명";
        }
        if (this.viewCount == 0) {
            this.viewCount = 0;
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.content == null) {
            this.content = "";
        }
        if (this.fileUrl == null) {
            this.fileUrl = "";
        }
        if (this.fileName == null) {
            this.fileName = "";
        }
        if (this.imageUrl == null) {
            this.imageUrl = "";
        }
    }


    public void addComment(Community_Comment comment) {
        comments.add(comment);
        comment.setCommunity(this);
    }
}
