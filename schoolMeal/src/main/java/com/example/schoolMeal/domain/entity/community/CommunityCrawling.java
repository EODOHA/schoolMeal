package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityCrawling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String link;
    private String description;  // 화면에 보일 요약? 내용
    private String pubDate;
    private String keyword;  // 예: "급식" 또는 "연구"
}