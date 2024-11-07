package com.example.schoolMeal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@NoArgsConstructor
@Entity
@Table(name = "community")
@Getter
@Setter
@ToString
@EntityListeners(AuditingEntityListener.class)
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // 게시물 제녹

    @Column(length = 2000)
    private String content;     //게시물 내용

    @ColumnDefault("0")
    private int viewCount;      //조회수 , 기본값0

    private String author;      // 작성자 정보

    private String categoryName; // 카테고리이름

    @CreatedDate
    private LocalDateTime createdAt;    // 생성일 (자동 생성)

    @LastModifiedDate
    private LocalDateTime updatedAt;    // 수정일 (자동 수정)

    @Builder
    public Community(Long id, String title, String content, int viewCount, String author, String categoryName) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author;
        this.categoryName = categoryName;
    }
}
