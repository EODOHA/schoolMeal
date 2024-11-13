package com.example.schoolMeal.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class CommunityCrawling {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;         // 제목
    private String content;       // 내용
    private String source;        // 출처 (뉴스 출처 또는 자료 출처)
    private LocalDateTime date;   // 게시일
    private String category;      // 카테고리: "급식뉴스/소식지" 또는 "학술/연구자료"

}
