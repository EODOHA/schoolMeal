package com.example.schoolMeal.dto.mealCounsel;

import com.example.schoolMeal.domain.entity.mealCounsel.MealCounsel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    private List<MealCounselFileDTO> files;

    @Builder
    public MealCounselResponseDTO(Long id, String title, String content, int viewCount, String author,
                                  String youtubeHtml, LocalDateTime createdAt, LocalDateTime updatedAt,
                                  List<MealCounselFileDTO> files) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author;
        this.youtubeHtml = youtubeHtml;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.files = files;
    }

    public static MealCounselResponseDTO fromEntity(MealCounsel mealCounsel) {
        return MealCounselResponseDTO.builder()
                .id(mealCounsel.getId())
                .title(mealCounsel.getTitle())
                .content(mealCounsel.getContent())
                .viewCount(mealCounsel.getViewCount())
                .author(mealCounsel.getAuthor())
                .youtubeHtml(mealCounsel.getYoutubeHtml())
                .createdAt(mealCounsel.getCreatedAt())
                .updatedAt(mealCounsel.getUpdatedAt())
                .files(mealCounsel.getFiles().stream()
                        .map(MealCounselFileDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
    
}
