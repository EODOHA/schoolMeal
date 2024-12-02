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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int viewCount;

    private String author;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    // 파일 정보와의 연관 관계 설정
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "file_id")
    private CommunityFile file;

    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public Notice() {
        this.createdDate = LocalDateTime.now();
        this.viewCount = 0;
    }

    public Notice(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdDate = LocalDateTime.now();
        this.viewCount = 0;
    }
}
