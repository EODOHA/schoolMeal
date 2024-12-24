package com.example.schoolMeal.domain.entity.mealCounsel;

//영양상담기록 entity
import jakarta.persistence.*;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "counsel_history")
@Getter
@Setter
@NoArgsConstructor
public class CounselHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "상담 제목은 필수입니다.")
    private String title; // 상담 제목

    @NotBlank(message = "작성자는 필수입니다.")
    private String author; // 작성자

    @NotBlank(message = "상담 내용은 필수입니다.")
    private String counselContent; // 상담 내용

    @NotBlank(message = "상담 결과는 필수입니다.")
    private String counselResult; // 상담 결과

    private String significant; // 특이사항

    private String studentHistory; // 학생 상담 이력

    @PastOrPresent(message = "상담일은 과거 또는 현재여야 합니다.")
    private LocalDate counselDate; // 상담일

    // 빌더 패턴을 이용한 생성자
    @Builder
    public CounselHistory(String title, String author, String counselContent, String counselResult,
                          String specialNotes, String studentHistory, LocalDate counselDate) {
        this.title = title;
        this.author = author;
        this.counselContent = counselContent;
        this.counselResult = counselResult;
        this.
                significant = specialNotes;
        this.studentHistory = studentHistory;
        this.counselDate = counselDate;
    }
    
}

