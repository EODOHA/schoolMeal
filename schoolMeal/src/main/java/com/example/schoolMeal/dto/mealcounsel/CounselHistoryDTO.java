package com.example.schoolMeal.dto.mealcounsel;

//영양상담기록 DTO
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CounselHistoryDTO {

    @NotBlank(message = "상담 제목은 필수입니다.")
    private String title; // 상담 제목

    @NotBlank(message = "작성자는 필수입니다.")
    private String author; // 작성자

    @NotBlank(message = "상담 내용은 필수입니다.")
    private String counselContent; //상담 내용

    @NotBlank(message = "상담 결과는 필수입니다.")
    private String counselResult; //상담 결과

    private String specialNotes; //특이 사항

    private String studentHistory; //학생 상담 이력

    @PastOrPresent(message = "상담일은 과거 또는 현재여야 합니다.")
    private LocalDate counselDate; //상담 일자
}


