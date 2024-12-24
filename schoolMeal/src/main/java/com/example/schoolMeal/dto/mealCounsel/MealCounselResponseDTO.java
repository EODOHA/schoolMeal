package com.example.schoolMeal.dto.mealCounsel;

import com.example.schoolMeal.domain.entity.mealCounsel.MealCounsel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MealCounselResponseDTO {

    private Long id;
    private String title;
    private String content;
    private int viewCount;
    private String author;
    private String youtubeHtml;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Long> fileIds; // 파일 ID 리스트로 변경

    @Builder
    public MealCounselResponseDTO(Long id, String title, String content, int viewCount, String author,
                                  String youtubeHtml, LocalDateTime createdAt, LocalDateTime updatedAt,
                                  List<Long> fileIds) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author;
        this.youtubeHtml = youtubeHtml;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.fileIds = fileIds;
    }

    public static MealCounselResponseDTO fromEntity(MealCounsel mealCounsel) {
        return MealCounselResponseDTO.builder()
                .id(mealCounsel.getId())
                .title(mealCounsel.getTitle())
                .content(mealCounsel.getContent())
                .viewCount(mealCounsel.getViewCount())
                // 예: 회원 아이디 기준으로 표시
                .author(mealCounsel.getAuthor())
                .youtubeHtml(mealCounsel.getYoutubeHtml())
                .createdAt(mealCounsel.getCreatedAt())
                .updatedAt(mealCounsel.getUpdatedAt())
                .fileIds(mealCounsel.getFileIds())
                .build();
    }
}

